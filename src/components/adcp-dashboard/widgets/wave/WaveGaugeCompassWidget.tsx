import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useADCPData } from '@/hooks/useADCPData';
import { WaveGaugeCompassSettings } from '@/types/ADCPDashboardTypes';
import { WAVE_PARAMETER_META } from '@/types/NMEATypes';

interface WaveGaugeCompassWidgetProps {
  id: string;
  settings: WaveGaugeCompassSettings;
  isEditing?: boolean;
}

export function WaveGaugeCompassWidget({ id, settings, isEditing = false }: WaveGaugeCompassWidgetProps) {
  const { getCurrentWaveData } = useADCPData();
  
  const waveData = getCurrentWaveData();

  const getParameterValue = (parameter: string): number | null => {
    if (!waveData) return null;
    return (waveData as any)[parameter] ?? null;
  };

  const getParameterMeta = (parameter: string) => {
    return WAVE_PARAMETER_META[parameter as keyof typeof WAVE_PARAMETER_META] || {
      label: parameter,
      unit: '',
      range: [0, 100],
      decimalPlaces: 2
    };
  };

  const getGaugeSize = () => {
    switch (settings.gaugeSize) {
      case 'small': return 60;
      case 'large': return 100;
      default: return 80;
    }
  };

  const renderGauge = (parameter: string) => {
    const value = getParameterValue(parameter);
    const meta = getParameterMeta(parameter);
    const size = getGaugeSize();
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    
    if (value === null) {
      return (
        <div className="flex flex-col items-center space-y-1">
          <div 
            className="relative flex items-center justify-center border-2 border-muted rounded-full"
            style={{ width: size, height: size }}
          >
            <span className="text-xs text-muted-foreground">N/A</span>
          </div>
          <p className="text-xs text-center">{meta.label}</p>
        </div>
      );
    }

    const [min, max] = meta.range;
    const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - normalizedValue);
    
    const isAlert = settings.showAlertZones && 
                   settings.alertThresholds[parameter] && 
                   value > settings.alertThresholds[parameter];

    return (
      <div className="flex flex-col items-center space-y-1">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={isAlert ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.5s ease-in-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm font-mono font-bold">
                {value.toFixed(meta.decimalPlaces)}
              </div>
              <div className="text-xs text-muted-foreground">
                {meta.unit}
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-center">{meta.label}</p>
      </div>
    );
  };

  const renderCompass = () => {
    const directionValue = getParameterValue(settings.compassParameter);
    const size = 120;
    const radius = size / 2 - 15;
    
    if (directionValue === null) {
      return (
        <div className="flex flex-col items-center space-y-2">
          <div 
            className="relative flex items-center justify-center border-2 border-muted rounded-full"
            style={{ width: size, height: size }}
          >
            <span className="text-sm text-muted-foreground">N/A</span>
          </div>
          <p className="text-xs text-center">Direction</p>
        </div>
      );
    }

    const angleRad = (directionValue * Math.PI) / 180;
    const arrowLength = radius * 0.7;
    const arrowX = size / 2 + arrowLength * Math.sin(angleRad);
    const arrowY = size / 2 - arrowLength * Math.cos(angleRad);

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size}>
            {/* Compass circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            
            {/* Cardinal directions */}
            <text x={size / 2} y="15" textAnchor="middle" className="text-xs font-medium" fill="currentColor">N</text>
            <text x={size - 8} y={size / 2 + 4} textAnchor="middle" className="text-xs font-medium" fill="currentColor">E</text>
            <text x={size / 2} y={size - 5} textAnchor="middle" className="text-xs font-medium" fill="currentColor">S</text>
            <text x="8" y={size / 2 + 4} textAnchor="middle" className="text-xs font-medium" fill="currentColor">W</text>
            
            {/* Direction arrow */}
            <line
              x1={size / 2}
              y1={size / 2}
              x2={arrowX}
              y2={arrowY}
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Arrow head */}
            <polygon
              points={`${arrowX},${arrowY} ${arrowX - 4 * Math.sin(angleRad + Math.PI / 6)},${arrowY + 4 * Math.cos(angleRad + Math.PI / 6)} ${arrowX - 4 * Math.sin(angleRad - Math.PI / 6)},${arrowY + 4 * Math.cos(angleRad - Math.PI / 6)}`}
              fill="hsl(var(--primary))"
            />
            
            {/* Center dot */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r="3"
              fill="hsl(var(--primary))"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center mt-8">
              <div className="text-lg font-mono font-bold">
                {directionValue.toFixed(0)}°
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-center">
          {settings.compassParameter === 'dirTp' ? 'Peak Direction' : 'Main Direction'}
        </p>
      </div>
    );
  };

  return (
    <Card className={`h-full ${isEditing ? 'ring-2 ring-primary/20' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Wave Gauges & Direction</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-full flex flex-col space-y-4">
          {/* Gauges */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3 justify-items-center">
              {settings.gaugeParameters.slice(0, 4).map((parameter, index) => (
                <div key={parameter}>
                  {renderGauge(parameter)}
                </div>
              ))}
            </div>
          </div>
          
          {/* Compass */}
          <div className="flex justify-center">
            {renderCompass()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}