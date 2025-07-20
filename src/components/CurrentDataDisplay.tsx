
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppContext } from '@/contexts/AppContext';

export const CurrentDataDisplay: React.FC = () => {
  const { t } = useTranslation();
  const { currentData } = useAppContext();

  // Preparar dados para visualização Hovmöller
  const hovmollerData = useMemo(() => {
    if (!currentData.length) return { times: [], depths: [], timeGroups: new Map(), latestData: [] };

    // Agrupar dados por timestamp exato
    const timeGroups = new Map<number, Map<number, any>>();
    
    currentData.forEach(data => {
      const timeKey = data.timestamp.getTime();
      if (!timeGroups.has(timeKey)) {
        timeGroups.set(timeKey, new Map());
      }
      timeGroups.get(timeKey)!.set(data.depth, data);
    });

    // Pegar os últimos 20 timestamps únicos
    const times = Array.from(timeGroups.keys()).sort().slice(-20);
    // Padronizar para 15 células (conforme será definido pelo NMEA PNORI no futuro)
    const depths = Array.from(new Set(currentData.map(d => d.depth))).sort().slice(0, 15);

    // Obter dados mais recentes para tabela
    const latestTime = times[times.length - 1];
    const latestData = latestTime ? Array.from(timeGroups.get(latestTime)?.values() || []) : [];

    console.log('Hovmöller data prepared:', { 
      times: times.length, 
      depths: depths.length, 
      latest: latestData.length,
      totalProfiles: timeGroups.size
    });

    return { times, depths, timeGroups, latestData };
  }, [currentData]);

  // Viridis color scale implementation
  const getViridisColor = (value: number) => {
    // Normalize value to 0-1 range for direction (0-360°)
    const t = Math.max(0, Math.min(1, value / 360));
    
    // Viridis color scale - RGB values
    const viridisColors = [
      [68, 1, 84],    // Dark purple
      [72, 40, 120],  // Purple
      [62, 74, 137],  // Blue-purple
      [49, 104, 142], // Blue
      [38, 130, 142], // Teal
      [31, 158, 137], // Green-teal
      [53, 183, 121], // Green
      [109, 205, 89], // Light green
      [180, 222, 44], // Yellow-green
      [253, 231, 37]  // Yellow
    ];
    
    const index = Math.floor(t * (viridisColors.length - 1));
    const fraction = (t * (viridisColors.length - 1)) - index;
    
    if (index >= viridisColors.length - 1) {
      const [r, g, b] = viridisColors[viridisColors.length - 1];
      return `rgb(${r}, ${g}, ${b})`;
    }
    
    const [r1, g1, b1] = viridisColors[index];
    const [r2, g2, b2] = viridisColors[index + 1];
    
    const r = Math.round(r1 + (r2 - r1) * fraction);
    const g = Math.round(g1 + (g2 - g1) * fraction);
    const b = Math.round(b1 + (b2 - b1) * fraction);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getColorForValue = (value: number, type: 'velocity' | 'direction') => {
    if (type === 'velocity') {
      // White to red scale for velocity (0-0.5 m/s)
      const intensity = Math.min(value / 0.5, 1);
      const red = 255;
      const green = Math.floor(255 * (1 - intensity));
      const blue = Math.floor(255 * (1 - intensity));
      return `rgb(${red}, ${green}, ${blue})`;
    } else {
      // Use Viridis scale for direction
      return getViridisColor(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico Hovmöller - Velocidade */}
        <Card>
          <CardHeader>
            <CardTitle>{t('currents.velocity')} - Hovmöller</CardTitle>
          </CardHeader>
          <CardContent>
            {hovmollerData.times.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">
                  {t('currents.intensity')} (0-0.5 m/s) - {hovmollerData.times.length} perfis temporais
                </div>
                <div className="relative overflow-auto">
                  {/* Eixo Y - Profundidade */}
                  <div className="absolute left-0 top-0 h-full w-16 flex flex-col justify-between text-xs z-10 bg-background">
                    {hovmollerData.depths.map((depth, idx) => (
                      <div key={depth} className="text-right pr-2 h-4 flex items-center">
                        {depth.toFixed(1)}m
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid de dados */}
                  <div className="ml-16 space-y-1">
                    {hovmollerData.depths.map(depth => (
                      <div key={depth} className="flex space-x-1">
                        {hovmollerData.times.map((time, idx) => {
                          const data = hovmollerData.timeGroups.get(time)?.get(depth);
                          const value = data?.velocity || 0;
                          return (
                            <div
                              key={`${time}-${depth}`}
                              className="w-6 h-4 border border-gray-200 cursor-pointer"
                              style={{ backgroundColor: getColorForValue(value, 'velocity') }}
                              title={`${new Date(time).toLocaleTimeString()} - ${depth}m: ${value.toFixed(3)} m/s`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  
                  {/* Escala de cores */}
                  <div className="ml-16 mt-4 flex items-center gap-2 text-xs">
                    <span>0</span>
                    <div className="flex h-4 w-32">
                      {Array.from({length: 20}, (_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-full"
                          style={{ backgroundColor: getColorForValue((i/20) * 0.5, 'velocity') }}
                        />
                      ))}
                    </div>
                    <span>0.5 m/s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                {t('noData')} - Inicie a medição para ver os dados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico Hovmöller - Direção */}
        <Card>
          <CardHeader>
            <CardTitle>{t('currents.direction')} - Hovmöller</CardTitle>
          </CardHeader>
          <CardContent>
            {hovmollerData.times.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">
                  {t('currents.angle')} (0-360°) - Escala Viridis - {hovmollerData.times.length} perfis temporais
                </div>
                <div className="relative overflow-auto">
                  {/* Eixo Y - Profundidade */}
                  <div className="absolute left-0 top-0 h-full w-16 flex flex-col justify-between text-xs z-10 bg-background">
                    {hovmollerData.depths.map((depth, idx) => (
                      <div key={depth} className="text-right pr-2 h-4 flex items-center">
                        {depth.toFixed(1)}m
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid de dados */}
                  <div className="ml-16 space-y-1">
                    {hovmollerData.depths.map(depth => (
                      <div key={depth} className="flex space-x-1">
                        {hovmollerData.times.map((time, idx) => {
                          const data = hovmollerData.timeGroups.get(time)?.get(depth);
                          const value = data?.direction || 0;
                          return (
                            <div
                              key={`${time}-${depth}`}
                              className="w-6 h-4 border border-gray-200 cursor-pointer"
                              style={{ backgroundColor: getColorForValue(value, 'direction') }}
                              title={`${new Date(time).toLocaleTimeString()} - ${depth}m: ${value.toFixed(1)}°`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  
                  {/* Escala de cores Viridis */}
                  <div className="ml-16 mt-4 flex items-center gap-2 text-xs">
                    <span>0°</span>
                    <div className="flex h-4 w-32">
                      {Array.from({length: 20}, (_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-full"
                          style={{ backgroundColor: getViridisColor((i/20) * 360) }}
                        />
                      ))}
                    </div>
                    <span>360°</span>
                  </div>
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

      {/* Tabela com dados mais recentes */}
      {hovmollerData.latestData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {hovmollerData.times.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {new Date(hovmollerData.times[hovmollerData.times.length - 1]).toLocaleString()} - 
                </span>
              )}
              {" "}Dados Mais Recentes - Perfil de Corrente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Célula</TableHead>
                    <TableHead>Profundidade (m)</TableHead>
                    <TableHead>Velocidade (m/s)</TableHead>
                    <TableHead>Direção (°)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hovmollerData.latestData
                    .sort((a, b) => a.depth - b.depth)
                    .slice(0, 15) // Padronizar para 15 células
                    .map((data, idx) => (
                    <TableRow key={`${data.cellNumber}-${data.timestamp.getTime()}`}>
                      <TableCell className="font-mono">{data.cellNumber}</TableCell>
                      <TableCell className="font-mono">{data.depth.toFixed(1)}</TableCell>
                      <TableCell className="font-mono text-blue-600">{data.velocity.toFixed(3)}</TableCell>
                      <TableCell className="font-mono text-green-600">{data.direction.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
