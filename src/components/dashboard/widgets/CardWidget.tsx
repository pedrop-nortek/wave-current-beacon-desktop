import React from 'react';
import { WidgetConfig } from '@/types/dashboard';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CardWidgetProps {
  config: WidgetConfig;
  isEditing?: boolean;
}

export function CardWidget({ config, isEditing = false }: CardWidgetProps) {
  const { waveData, currentData } = useAppContext();

  const getLatestValue = () => {
    const latestWave = waveData?.[waveData.length - 1];
    const latestCurrent = currentData?.[currentData.length - 1];
    
    switch (config.parameter) {
      case 'hm0':
        return latestWave?.hm0 || 0;
      case 'hmax':
        return latestWave?.hmax || 0;
      case 'mdir':
        return latestWave?.mdir || 0;
      case 'tm02':
        return latestWave?.tm02 || 0;
      case 'tp':
        return latestWave?.tp || 0;
      case 'velocity':
        return latestCurrent?.velocity || 0;
      case 'direction':
        return latestCurrent?.direction || 0;
      case 'temperature':
        return latestWave?.temperature || 0;
      case 'pressure':
        return latestWave?.pressure || 0;
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
      case 'hm0':
      case 'hmax':
      case 'depth':
        return 'm';
      case 'velocity':
        return 'm/s';
      case 'mdir':
      case 'direction':
      case 'pitch':
      case 'roll':
        return '°';
      case 'tm02':
      case 'tp':
        return 's';
      case 'temperature':
        return '°C';
      case 'pressure':
        return 'dBar';
      default:
        return config.settings?.units || '';
    }
  };

  const getDisplayName = () => {
    const names: Record<string, string> = {
      hm0: 'Wave Height',
      hmax: 'Max Wave Height',
      mdir: 'Wave Direction',
      tm02: 'Mean Period',
      tp: 'Peak Period',
      velocity: 'Current Speed',
      direction: 'Current Direction',
      temperature: 'Temperature',
      pressure: 'Pressure',
      pitch: 'Pitch',
      roll: 'Roll',
      depth: 'Depth'
    };
    return names[config.parameter] || config.parameter.toUpperCase();
  };

  const value = getLatestValue();
  const units = getUnits();
  const displayName = getDisplayName();
  
  // Simulate trend (in real implementation, this would be calculated from historical data)
  const trend = Math.random() > 0.5 ? 'up' : 'down';
  const trendValue = (Math.random() * 10).toFixed(1);

  const getValueColor = () => {
    const dangerZone = config.settings?.dangerZone;
    const maxValue = config.settings?.maxValue;
    
    if (dangerZone && maxValue) {
      const percentage = (value / maxValue) * 100;
      if (percentage >= dangerZone) return 'text-destructive';
    }
    
    return 'text-foreground';
  };

  return (
    <Card className={`h-full ${isEditing ? 'border-dashed' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {displayName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${getValueColor()}`}>
              {value.toFixed(config.parameter.includes('dir') ? 0 : 2)}
            </span>
            <span className="text-sm text-muted-foreground">
              {units}
            </span>
          </div>
          
          {config.settings?.showHistory && (
            <div className="flex items-center gap-1 text-xs">
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {trendValue}%
              </span>
              <span className="text-muted-foreground">vs last hour</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}