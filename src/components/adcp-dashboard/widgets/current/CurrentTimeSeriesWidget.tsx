import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useADCPData } from '@/hooks/useADCPData';
import { CURRENT_PARAMETER_META, CurrentParameter } from '@/types/NMEATypes';
import { CurrentTimeSeriesSettings } from '@/types/ADCPDashboardTypes';
import { format } from 'date-fns';

interface CurrentTimeSeriesWidgetProps {
  id: string;
  settings: CurrentTimeSeriesSettings;
  isEditing?: boolean;
}

export function CurrentTimeSeriesWidget({ id, settings, isEditing = false }: CurrentTimeSeriesWidgetProps) {
  const { getTimeSeriesData } = useADCPData();
  
  const parameterMeta = CURRENT_PARAMETER_META[settings.parameter];
  const data = getTimeSeriesData('current', settings.parameter, settings.timeRange);

  const formatValue = (value: number): string => {
    return value.toFixed(parameterMeta.decimalPlaces);
  };

  const formatTimestamp = (timestamp: string): string => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const getYAxisDomain = (): [number, number] => {
    if (settings.yAxisMin !== undefined && settings.yAxisMax !== undefined) {
      return [settings.yAxisMin, settings.yAxisMax];
    }
    
    if (data.length === 0) {
      return parameterMeta.range;
    }

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    
    return [min - padding, max + padding];
  };

  const yDomain = getYAxisDomain();
  const latestValue = data.length > 0 ? data[data.length - 1].value : null;

  return (
    <Card className={`h-full ${isEditing ? 'ring-2 ring-primary/20' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{parameterMeta.label}</span>
          {latestValue !== null && (
            <span className="text-lg font-mono">
              {formatValue(latestValue)} {parameterMeta.unit}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              {settings.showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              )}
              <XAxis 
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                domain={yDomain}
                tickFormatter={formatValue}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                width={40}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${formatValue(value)} ${parameterMeta.unit}`,
                  parameterMeta.label
                ]}
                labelFormatter={(timestamp: string) => 
                  format(new Date(timestamp), 'MMM dd, HH:mm:ss')
                }
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Line
                type={settings.smoothing ? "monotone" : "linear"}
                dataKey="value"
                stroke={settings.lineColor || 'hsl(var(--primary))'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: settings.lineColor || 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}