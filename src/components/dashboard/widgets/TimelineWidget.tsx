import React from 'react';
import { WidgetConfig } from '@/types/dashboard';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface TimelineWidgetProps {
  config: WidgetConfig;
  isEditing?: boolean;
}

export function TimelineWidget({ config, isEditing = false }: TimelineWidgetProps) {
  const { waveData, currentData } = useAppContext();
  
  const getDataHistory = () => {
    // For demo purposes, generate some historical data
    const now = new Date();
    const points = [];
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000); // 15-minute intervals
      let value = 0;
      
      switch (config.parameter) {
        case 'hm0':
          value = Math.random() * 3 + 0.5; // 0.5-3.5m
          break;
        case 'hmax':
          value = Math.random() * 5 + 1; // 1-6m
          break;
        case 'velocity':
          value = Math.random() * 1.5 + 0.1; // 0.1-1.6 m/s
          break;
        case 'temperature':
          value = Math.random() * 5 + 18; // 18-23°C
          break;
        case 'pressure':
          value = Math.random() * 0.5 + 10; // 10-10.5 dBar
          break;
        default:
          value = Math.random() * 10;
      }
      
      points.push({
        time: format(timestamp, 'HH:mm'),
        value: Number(value.toFixed(2)),
        timestamp
      });
    }
    
    return points;
  };

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
      default:
        return 0;
    }
  };

  const getUnits = () => {
    switch (config.parameter) {
      case 'hm0':
      case 'hmax':
        return 'm';
      case 'velocity':
        return 'm/s';
      case 'mdir':
      case 'direction':
        return '°';
      case 'tm02':
      case 'tp':
        return 's';
      case 'temperature':
        return '°C';
      case 'pressure':
        return 'dBar';
      default:
        return '';
    }
  };

  const data = getDataHistory();
  const currentValue = getLatestValue();
  const units = config.settings?.units || getUnits();

  return (
    <Card className={`h-full ${isEditing ? 'border-dashed' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {config.title}
          <span className="text-lg font-bold">
            {currentValue.toFixed(2)} {units}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              domain={['dataMin - 0.1', 'dataMax + 0.1']}
            />
            <Tooltip 
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(value: number) => [`${value} ${units}`, config.parameter.toUpperCase()]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}