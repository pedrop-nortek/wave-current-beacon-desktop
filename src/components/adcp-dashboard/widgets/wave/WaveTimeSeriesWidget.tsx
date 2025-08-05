import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useADCPData } from '@/hooks/useADCPData';
import { WAVE_PARAMETER_META } from '@/types/NMEATypes';
import { WaveTimeSeriesSettings } from '@/types/ADCPDashboardTypes';
import { format } from 'date-fns';

interface WaveTimeSeriesWidgetProps {
  id: string;
  settings: WaveTimeSeriesSettings;
  isEditing?: boolean;
}

export function WaveTimeSeriesWidget({ id, settings, isEditing = false }: WaveTimeSeriesWidgetProps) {
  const { getTimeSeriesData } = useADCPData();
  
  const parameterMeta = WAVE_PARAMETER_META[settings.parameter];
  const data = getTimeSeriesData('wave', settings.parameter, settings.timeRange);

  const formatValue = (value: number): string => {
    return value.toFixed(parameterMeta.decimalPlaces);
  };

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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            {settings.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(timestamp: string) => format(new Date(timestamp), 'HH:mm')}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              tickFormatter={formatValue}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              width={40}
            />
            <Tooltip
              formatter={(value: number) => [`${formatValue(value)} ${parameterMeta.unit}`, parameterMeta.label]}
              labelFormatter={(timestamp: string) => format(new Date(timestamp), 'MMM dd, HH:mm:ss')}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={settings.lineColor || 'hsl(var(--primary))'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
            {settings.showAlertThresholds && settings.alertThreshold && (
              <Line
                type="linear"
                dataKey={() => settings.alertThreshold}
                stroke="hsl(var(--destructive))"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}