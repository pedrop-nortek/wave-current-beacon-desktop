

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useAppContext } from '@/contexts/AppContext';
import { format } from 'date-fns';

const chartConfig = {
  hm0: {
    label: "Hm0",
    color: "hsl(var(--chart-1))",
  },
  hmax: {
    label: "Hmax", 
    color: "hsl(var(--chart-2))",
  },
  mdir: {
    label: "Mdir",
    color: "hsl(var(--chart-3))",
  },
  tm02: {
    label: "Tm02",
    color: "hsl(var(--chart-4))",
  },
};

export const WaveDataDisplay: React.FC = () => {
  const { t } = useTranslation();
  const { waveData, lastWaveData } = useAppContext();

  const chartData = waveData.slice(-50).map(data => ({
    time: format(data.timestamp, 'HH:mm:ss'),
    hm0: data.hm0,
    hmax: data.hmax,
    mdir: data.mdir,
    tm02: data.tm02
  }));

  console.log('Wave chart data points:', chartData.length);

  return (
    <div className="space-y-6">
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('waves.hm0')} & {t('waves.hmax')}</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="hm0" 
                    stroke="var(--color-hm0)" 
                    strokeWidth={3}
                    dot={{ r: 3, fill: "var(--color-hm0)" }}
                    activeDot={{ r: 5, stroke: "var(--color-hm0)", strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hmax" 
                    stroke="var(--color-hmax)" 
                    strokeWidth={3}
                    dot={{ r: 3, fill: "var(--color-hmax)" }}
                    activeDot={{ r: 5, stroke: "var(--color-hmax)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded">
                <div className="text-muted-foreground">
                  {t('noData')} - Inicie a medição para ver os dados
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('waves.mdir')}</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    domain={[0, 360]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="mdir" 
                    stroke="var(--color-mdir)" 
                    strokeWidth={3}
                    dot={{ r: 3, fill: "var(--color-mdir)" }}
                    activeDot={{ r: 5, stroke: "var(--color-mdir)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded">
                <div className="text-muted-foreground">
                  {t('noData')} - Inicie a medição para ver os dados
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('waves.tm02')}</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="tm02" 
                    stroke="var(--color-tm02)" 
                    strokeWidth={3}
                    dot={{ r: 3, fill: "var(--color-tm02)" }}
                    activeDot={{ r: 5, stroke: "var(--color-tm02)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded">
                <div className="text-muted-foreground">
                  {t('noData')} - Inicie a medição para ver os dados
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Últimos valores */}
        <Card>
          <CardHeader>
            <CardTitle>{t('waves.lastValues')}</CardTitle>
          </CardHeader>
          <CardContent>
            {lastWaveData ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t('waves.hm0')}:</span>
                  <span className="ml-2 text-blue-600 font-mono">{lastWaveData.hm0.toFixed(2)} m</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.hmax')}:</span>
                  <span className="ml-2 text-red-600 font-mono">{lastWaveData.hmax.toFixed(2)} m</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.mdir')}:</span>
                  <span className="ml-2 text-green-600 font-mono">{lastWaveData.mdir.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.tm02')}:</span>
                  <span className="ml-2 text-purple-600 font-mono">{lastWaveData.tm02.toFixed(2)} s</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.tp')}:</span>
                  <span className="ml-2 font-mono">{lastWaveData.tp.toFixed(2)} s</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.pressure')}:</span>
                  <span className="ml-2 font-mono">{lastWaveData.pressure.toFixed(1)} hPa</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.temperature')}:</span>
                  <span className="ml-2 font-mono">{lastWaveData.temperature.toFixed(1)}°C</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.pitch')}:</span>
                  <span className="ml-2 font-mono">{lastWaveData.pitch.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.roll')}:</span>
                  <span className="ml-2 font-mono">{lastWaveData.roll.toFixed(1)}°</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">{t('waves.datetime')}:</span>
                  <span className="ml-2 font-mono">{lastWaveData.timestamp.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                {t('noData')} - Inicie a medição para ver os dados
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

