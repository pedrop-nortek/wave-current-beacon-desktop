import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';

export const CurrentDataDisplay: React.FC = () => {
  const { t } = useTranslation();
  const { currentData } = useAppContext();

  // Preparar dados para visualização Hovmöller
  const hovmollerData = useMemo(() => {
    if (!currentData.length) return { velocity: [], direction: [] };

    // Agrupar dados por tempo e profundidade
    const timeGroups = new Map();
    
    currentData.forEach(data => {
      const timeKey = Math.floor(data.timestamp.getTime() / 10000) * 10000; // Grupos de 10s
      if (!timeGroups.has(timeKey)) {
        timeGroups.set(timeKey, new Map());
      }
      timeGroups.get(timeKey).set(data.depth, data);
    });

    const times = Array.from(timeGroups.keys()).sort().slice(-30); // Últimos 30 grupos
    const depths = Array.from(new Set(currentData.map(d => d.depth))).sort();

    const velocity = times.map(time => {
      const row = { time: new Date(time).toLocaleTimeString() };
      depths.forEach(depth => {
        const data = timeGroups.get(time)?.get(depth);
        row[`depth_${depth}`] = data?.velocity || 0;
      });
      return row;
    });

    const direction = times.map(time => {
      const row = { time: new Date(time).toLocaleTimeString() };
      depths.forEach(depth => {
        const data = timeGroups.get(time)?.get(depth);
        row[`depth_${depth}`] = data?.direction || 0;
      });
      return row;
    });

    return { velocity, direction, depths };
  }, [currentData]);

  const getColorForValue = (value: number, type: 'velocity' | 'direction') => {
    if (type === 'velocity') {
      // Escala de cores para velocidade (0-1 m/s)
      const intensity = Math.min(value / 1.0, 1);
      const red = Math.floor(intensity * 255);
      const blue = Math.floor((1 - intensity) * 255);
      return `rgb(${red}, 0, ${blue})`;
    } else {
      // Escala de cores para direção (0-360°)
      const hue = (value / 360) * 360;
      return `hsl(${hue}, 70%, 50%)`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico Hovmöller - Velocidade */}
        <Card>
          <CardHeader>
            <CardTitle>{t('currents.velocity')}</CardTitle>
          </CardHeader>
          <CardContent>
            {hovmollerData.velocity.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">
                  {t('currents.intensity')} (0-1 m/s)
                </div>
                <div className="relative">
                  {/* Eixo Y - Profundidade */}
                  <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between text-xs">
                    {hovmollerData.depths?.map(depth => (
                      <div key={depth} className="text-right pr-2">
                        {depth.toFixed(1)}m
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid de dados */}
                  <div className="ml-12 space-y-1">
                    {hovmollerData.depths?.map(depth => (
                      <div key={depth} className="flex space-x-1">
                        {hovmollerData.velocity.map((timeData, idx) => {
                          const value = timeData[`depth_${depth}`] || 0;
                          return (
                            <div
                              key={idx}
                              className="w-4 h-4 border border-gray-200"
                              style={{ backgroundColor: getColorForValue(value, 'velocity') }}
                              title={`${timeData.time} - ${depth}m: ${value.toFixed(3)} m/s`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  
                  {/* Eixo X - Tempo */}
                  <div className="ml-12 mt-2 flex justify-between text-xs">
                    {hovmollerData.velocity.slice(0, 5).map((timeData, idx) => (
                      <div key={idx} className="text-center">
                        {timeData.time}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Escala de cores */}
                <div className="flex items-center gap-2 text-xs">
                  <span>0</span>
                  <div className="flex h-4 w-20">
                    {Array.from({length: 10}, (_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-full"
                        style={{ backgroundColor: getColorForValue(i/10, 'velocity') }}
                      />
                    ))}
                  </div>
                  <span>1 m/s</span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                {t('noData')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico Hovmöller - Direção */}
        <Card>
          <CardHeader>
            <CardTitle>{t('currents.direction')}</CardTitle>
          </CardHeader>
          <CardContent>
            {hovmollerData.direction.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">
                  {t('currents.angle')} (0-360°)
                </div>
                <div className="relative">
                  {/* Eixo Y - Profundidade */}
                  <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between text-xs">
                    {hovmollerData.depths?.map(depth => (
                      <div key={depth} className="text-right pr-2">
                        {depth.toFixed(1)}m
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid de dados */}
                  <div className="ml-12 space-y-1">
                    {hovmollerData.depths?.map(depth => (
                      <div key={depth} className="flex space-x-1">
                        {hovmollerData.direction.map((timeData, idx) => {
                          const value = timeData[`depth_${depth}`] || 0;
                          return (
                            <div
                              key={idx}
                              className="w-4 h-4 border border-gray-200"
                              style={{ backgroundColor: getColorForValue(value, 'direction') }}
                              title={`${timeData.time} - ${depth}m: ${value.toFixed(1)}°`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  
                  {/* Eixo X - Tempo */}
                  <div className="ml-12 mt-2 flex justify-between text-xs">
                    {hovmollerData.direction.slice(0, 5).map((timeData, idx) => (
                      <div key={idx} className="text-center">
                        {timeData.time}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Escala de cores circular */}
                <div className="flex items-center gap-2 text-xs">
                  <span>0°</span>
                  <div className="flex h-4 w-20">
                    {Array.from({length: 10}, (_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-full"
                        style={{ backgroundColor: getColorForValue((i/10) * 360, 'direction') }}
                      />
                    ))}
                  </div>
                  <span>360°</span>
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