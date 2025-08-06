import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useADCPData } from '@/hooks/useADCPData';
import { WaveStatusTableSettings } from '@/types/ADCPDashboardTypes';
import { format } from 'date-fns';

interface WaveStatusTableWidgetProps {
  id: string;
  settings: WaveStatusTableSettings;
  isEditing?: boolean;
}

export function WaveStatusTableWidget({ id, settings, isEditing = false }: WaveStatusTableWidgetProps) {
  const { getCurrentWaveData } = useADCPData();
  
  const waveData = getCurrentWaveData();

  const getSpectrumBasisLabel = (type: number): string => {
    switch (type) {
      case 0: return 'Pressure';
      case 1: return 'Velocity';
      case 3: return 'AST';
      default: return `Unknown (${type})`;
    }
  };

  const getProcessingMethodLabel = (method: number): string => {
    switch (method) {
      case 1: return 'PUV';
      case 2: return 'SUV';
      case 3: return 'MLM';
      case 4: return 'MLMST';
      default: return `Unknown (${method})`;
    }
  };

  const formatValue = (value: number | undefined, unit: string, decimals: number = 2): string => {
    if (value === undefined || value === null) return 'N/A';
    return `${value.toFixed(decimals)} ${unit}`;
  };

  const formatInteger = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    return value.toString();
  };

  const getQualityStatus = () => {
    if (!waveData) return 'disconnected';
    if ((waveData.noDetects || 0) > 5) return 'poor';
    if ((waveData.badDetects || 0) > 3) return 'warning';
    return 'good';
  };

  const qualityStatus = getQualityStatus();

  return (
    <Card className={`h-full ${isEditing ? 'ring-2 ring-primary/20' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>Wave Status</span>
          <Badge variant={qualityStatus === 'good' ? 'default' : qualityStatus === 'warning' ? 'secondary' : 'destructive'}>
            {qualityStatus === 'good' ? 'Good' : qualityStatus === 'warning' ? 'Warning' : 'Poor'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-4 overflow-auto">
        {!waveData ? (
          <div className="text-center text-muted-foreground">
            <p>No wave data available</p>
          </div>
        ) : (
          <>
            {/* Timestamp */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Last Update</p>
              <p className="text-sm font-mono">
                {format(waveData.timestamp, 'MMM dd, HH:mm:ss')}
              </p>
            </div>

            <Separator />

            {/* Processing Info */}
            {settings.showProcessingInfo && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Spectrum Basis</p>
                    <p className="text-sm">{getSpectrumBasisLabel(waveData.spectrumBasis)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Processing</p>
                    <p className="text-sm">{getProcessingMethodLabel(waveData.processingMethod)}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Wave Heights */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Wave Heights</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Hm0:</span>
                  <span className="font-mono">{formatValue(waveData.hm0, 'm')}</span>
                </div>
                <div className="flex justify-between">
                  <span>H1/3:</span>
                  <span className="font-mono">{formatValue(waveData.h3, 'm')}</span>
                </div>
                <div className="flex justify-between">
                  <span>H1/10:</span>
                  <span className="font-mono">{formatValue(waveData.h10, 'm')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hmax:</span>
                  <span className="font-mono">{formatValue(waveData.hmax, 'm')}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Wave Periods */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Wave Periods</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Tm02:</span>
                  <span className="font-mono">{formatValue(waveData.tm02, 's')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tp:</span>
                  <span className="font-mono">{formatValue(waveData.tp, 's')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tz:</span>
                  <span className="font-mono">{formatValue(waveData.tz, 's')}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Wave Directions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Wave Directions</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Peak Dir:</span>
                  <span className="font-mono">{formatValue(waveData.dirTp, '°', 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Main Dir:</span>
                  <span className="font-mono">{formatValue(waveData.mainDirection, '°', 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Spread:</span>
                  <span className="font-mono">{formatValue(waveData.sprTp, '°', 0)}</span>
                </div>
              </div>
            </div>

            {/* Quality Metrics */}
            {settings.showQualityMetrics && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Quality Metrics</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>No Detects:</span>
                      <span className="font-mono">{formatInteger(waveData.noDetects)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bad Detects:</span>
                      <span className="font-mono">{formatInteger(waveData.badDetects)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unidirectivity:</span>
                      <span className="font-mono">{formatValue(waveData.unidirectivityIndex, '', 3)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Current Info */}
            {settings.showCurrentInfo && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Surface Current</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-mono">{formatValue(waveData.nearSurfaceCurrentSpeed, 'm/s')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Direction:</span>
                      <span className="font-mono">{formatValue(waveData.nearSurfaceCurrentDirection, '°', 0)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Additional Info */}
            <Separator />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Mean Pressure:</span>
                <span className="font-mono">{formatValue(waveData.meanPressure, 'dBar')}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}