import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAppContext } from '@/contexts/AppContext';
import { format } from 'date-fns';

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

  return (
    <div className="space-y-6">
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('waves.hm0')} & {t('waves.hmax')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded">
              <div className="text-muted-foreground">
                Gráfico Hm0 & Hmax - {chartData.length} pontos
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('waves.mdir')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded">
              <div className="text-muted-foreground">
                Gráfico Direção - {chartData.length} pontos
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('waves.tm02')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded">
              <div className="text-muted-foreground">
                Gráfico Tm02 - {chartData.length} pontos
              </div>
            </div>
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
                  <span className="ml-2">{lastWaveData.hm0.toFixed(2)} m</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.hmax')}:</span>
                  <span className="ml-2">{lastWaveData.hmax.toFixed(2)} m</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.mdir')}:</span>
                  <span className="ml-2">{lastWaveData.mdir.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.tm02')}:</span>
                  <span className="ml-2">{lastWaveData.tm02.toFixed(2)} s</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.tp')}:</span>
                  <span className="ml-2">{lastWaveData.tp.toFixed(2)} s</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.pressure')}:</span>
                  <span className="ml-2">{lastWaveData.pressure.toFixed(1)} hPa</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.temperature')}:</span>
                  <span className="ml-2">{lastWaveData.temperature.toFixed(1)}°C</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.pitch')}:</span>
                  <span className="ml-2">{lastWaveData.pitch.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.roll')}:</span>
                  <span className="ml-2">{lastWaveData.roll.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="font-medium">{t('waves.datetime')}:</span>
                  <span className="ml-2">{lastWaveData.timestamp.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                {t('noData')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};