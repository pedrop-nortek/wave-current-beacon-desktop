import React from 'react';
import { WidgetConfig } from '@/types/dashboard';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GaugeWidgetProps {
  config: WidgetConfig;
  isEditing?: boolean;
}

export function GaugeWidget({ config, isEditing = false }: GaugeWidgetProps) {
  const { waveData, currentData } = useAppContext();

  const getLatestValue = () => {
    const latestWave = waveData?.[waveData.length - 1];
    const latestCurrent = currentData?.[currentData.length - 1];
    
    switch (config.parameter) {
      case 'pressure':
        return latestWave?.pressure || 0;
      case 'temperature':
        return latestWave?.temperature || 0;
      case 'pitch':
        return latestWave?.pitch || 0;
      case 'roll':
        return latestWave?.roll || 0;
      case 'depth':
        return latestCurrent?.depth || 0;
      default:
        return 0;
    }
  };

  const getUnits = () => {
    switch (config.parameter) {
      case 'pressure':
        return 'dBar';
      case 'temperature':
        return '°C';
      case 'pitch':
      case 'roll':
        return '°';
      case 'depth':
        return 'm';
      default:
        return config.settings?.units || '';
    }
  };

  const value = getLatestValue();
  const units = getUnits();
  const minValue = config.settings?.minValue || 0;
  const maxValue = config.settings?.maxValue || 100;
  const percentage = Math.min(Math.max((value - minValue) / (maxValue - minValue) * 100, 0), 100);

  // Simple circular gauge using SVG
  const radius = 40;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    const dangerZone = config.settings?.dangerZone || 80;
    if (percentage >= dangerZone) return 'hsl(var(--destructive))';
    if (percentage >= 60) return 'hsl(var(--warning))';
    return 'hsl(var(--primary))';
  };

  return (
    <Card className={`h-full flex flex-col ${isEditing ? 'border-dashed' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-center">
          {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center">
        <div className="relative">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              stroke="hsl(var(--muted))"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke={getColor()}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeLinecap="round"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold">
              {value.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              {units}
            </span>
          </div>
        </div>
        
        <div className="mt-2 text-center">
          <div className="text-xs text-muted-foreground">
            {minValue} - {maxValue} {units}
          </div>
          <div className="text-xs font-medium">
            {percentage.toFixed(0)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}