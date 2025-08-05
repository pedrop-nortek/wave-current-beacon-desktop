import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useADCPData } from '@/hooks/useADCPData';
import { CurrentStatusTableSettings, DATA_QUALITY_THRESHOLDS } from '@/types/ADCPDashboardTypes';
import { Battery, Wifi, Thermometer, Gauge, Navigation, Zap } from 'lucide-react';
import { format } from 'date-fns';

interface CurrentStatusTableWidgetProps {
  id: string;
  settings: CurrentStatusTableSettings;
  isEditing?: boolean;
}

export function CurrentStatusTableWidget({ id, settings, isEditing = false }: CurrentStatusTableWidgetProps) {
  const { dataset } = useADCPData();
  
  const env = dataset.latestEnvironmental;
  const profile = dataset.latestProfile;
  const config = dataset.instrumentConfig;

  const getQualityBadge = (value: number, thresholds: typeof DATA_QUALITY_THRESHOLDS.battery) => {
    if (value >= thresholds.good) return <Badge variant="default" className="bg-green-500">Good</Badge>;
    if (value >= thresholds.warning) return <Badge variant="secondary">Warning</Badge>;
    return <Badge variant="destructive">Critical</Badge>;
  };

  const getTiltQualityBadge = (tilt: number) => {
    const thresholds = DATA_QUALITY_THRESHOLDS.tilt;
    if (tilt <= thresholds.good) return <Badge variant="default" className="bg-green-500">Good</Badge>;
    if (tilt <= thresholds.warning) return <Badge variant="secondary">Warning</Badge>;
    return <Badge variant="destructive">Critical</Badge>;
  };

  const formatValue = (value: number | undefined, decimals: number = 1, unit: string = ''): string => {
    if (value === undefined || isNaN(value)) return 'N/A';
    return `${value.toFixed(decimals)}${unit ? ' ' + unit : ''}`;
  };

  const StatusRow = ({ icon: Icon, label, value, badge }: { 
    icon: any, 
    label: string, 
    value: string, 
    badge?: React.ReactNode 
  }) => (
    <div className="flex items-center justify-between py-1 border-b border-border/30 last:border-b-0">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono">{value}</span>
        {badge}
      </div>
    </div>
  );

  return (
    <Card className={`h-full ${isEditing ? 'ring-2 ring-primary/20' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          ADCP Status
          {dataset.isConnected && (
            <Badge variant="default" className="bg-green-500 ml-auto">Connected</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-4">
        {/* Current Measurements */}
        {env && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Current Status
            </h4>
            <div className="space-y-1">
              <StatusRow
                icon={Battery}
                label="Battery"
                value={formatValue(env.batteryVoltage, 1, 'V')}
                badge={settings.showQualityIndicators && env.batteryVoltage ? 
                  getQualityBadge(env.batteryVoltage, DATA_QUALITY_THRESHOLDS.battery) : undefined}
              />
              <StatusRow
                icon={Thermometer}
                label="Temperature"
                value={formatValue(env.temperature, 1, '°C')}
              />
              <StatusRow
                icon={Gauge}
                label="Pressure"
                value={formatValue(env.pressure, 1, 'dBar')}
              />
              <StatusRow
                icon={Navigation}
                label="Heading"
                value={formatValue(env.heading, 1, '°')}
              />
              <StatusRow
                icon={Zap}
                label="Tilt"
                value={formatValue(env.tilt, 1, '°')}
                badge={settings.showQualityIndicators && env.tilt !== undefined ? 
                  getTiltQualityBadge(env.tilt) : undefined}
              />
              <StatusRow
                icon={Wifi}
                label="Sound Speed"
                value={formatValue(env.soundSpeed, 0, 'm/s')}
              />
            </div>
          </div>
        )}

        {/* Profile Statistics */}
        {profile && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Current Profile
            </h4>
            <div className="space-y-1">
              <StatusRow
                icon={Navigation}
                label="Mean Speed"
                value={formatValue(profile.profileMeanSpeed, 3, 'm/s')}
              />
              <StatusRow
                icon={Navigation}
                label="Mean Direction"
                value={formatValue(profile.profileMeanDirection, 1, '°')}
              />
              <StatusRow
                icon={Wifi}
                label="Valid Cells"
                value={`${profile.validCellCount}/${profile.cells.length}`}
              />
              <StatusRow
                icon={Gauge}
                label="Last Update"
                value={format(profile.timestamp, 'HH:mm:ss')}
              />
            </div>
          </div>
        )}

        {/* Instrument Configuration */}
        {settings.showInstrumentInfo && config && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Instrument Info
            </h4>
            <div className="space-y-1">
              <StatusRow
                icon={Wifi}
                label="Head ID"
                value={config.headId}
              />
              <StatusRow
                icon={Gauge}
                label="Cells"
                value={`${config.cellCount} × ${formatValue(config.cellSize, 1, 'm')}`}
              />
              <StatusRow
                icon={Navigation}
                label="Blanking"
                value={formatValue(config.blankingDistance, 1, 'm')}
              />
              <StatusRow
                icon={Zap}
                label="Beams"
                value={config.beamCount.toString()}
              />
              <StatusRow
                icon={Navigation}
                label="Coordinates"
                value={config.coordinateSystem === 0 ? 'ENU' : 
                       config.coordinateSystem === 1 ? 'XYZ' : 'BEAM'}
              />
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="pt-2 border-t border-border/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Last Update</span>
            <span className="font-mono">
              {dataset.lastUpdateTime ? format(dataset.lastUpdateTime, 'HH:mm:ss') : 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}