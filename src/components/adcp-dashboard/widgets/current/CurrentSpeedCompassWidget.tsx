import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useADCPData } from '@/hooks/useADCPData';
import { CurrentSpeedCompassSettings } from '@/types/ADCPDashboardTypes';
import { useMemo } from 'react';

interface CurrentSpeedCompassWidgetProps {
  id: string;
  settings: CurrentSpeedCompassSettings;
  isEditing?: boolean;
}

export function CurrentSpeedCompassWidget({ id, settings, isEditing = false }: CurrentSpeedCompassWidgetProps) {
  const { dataset } = useADCPData();
  
  const profile = dataset.latestProfile;
  
  // Calculate averaged values based on settings
  const { avgSpeed, avgDirection, qualityScore } = useMemo(() => {
    if (!profile) return { avgSpeed: 0, avgDirection: 0, qualityScore: 0 };

    // For simplicity, use the latest profile values
    // In a real implementation, you'd average over the specified window
    const speed = profile.profileMeanSpeed || 0;
    const direction = profile.profileMeanDirection || 0;
    
    // Calculate quality score based on valid cells
    const quality = profile.validCellCount / profile.cells.length;
    
    return { 
      avgSpeed: speed, 
      avgDirection: direction, 
      qualityScore: quality 
    };
  }, [profile, settings.averagingWindow]);

  const compassSize = settings.compassSize === 'small' ? 120 : 
                     settings.compassSize === 'medium' ? 160 : 200;
  const speedGaugeSize = 100;

  // Speedometer calculations
  const speedPercent = Math.min(avgSpeed / settings.speedScale[1], 1);
  const speedAngle = speedPercent * 180 - 90; // -90 to 90 degrees

  // Compass calculations  
  const compassAngle = avgDirection; // 0-360 degrees

  const getSpeedColor = (speed: number) => {
    const percent = speed / settings.speedScale[1];
    if (percent < 0.3) return 'hsl(var(--success))';
    if (percent < 0.7) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getQualityColor = (quality: number) => {
    if (quality > 0.8) return 'hsl(var(--success))';
    if (quality > 0.6) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  return (
    <Card className={`h-full ${isEditing ? 'ring-2 ring-primary/20' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Current Speed & Direction</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex flex-col items-center justify-center h-full">
        <div className="flex items-center justify-around w-full h-full gap-4">
          {/* Speed Gauge */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg width={speedGaugeSize} height={speedGaugeSize * 0.6} className="overflow-visible">
                {/* Background arc */}
                <path
                  d={`M 10 ${speedGaugeSize * 0.5} A ${speedGaugeSize * 0.4} ${speedGaugeSize * 0.4} 0 0 1 ${speedGaugeSize - 10} ${speedGaugeSize * 0.5}`}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="8"
                />
                
                {/* Speed arc */}
                <path
                  d={`M 10 ${speedGaugeSize * 0.5} A ${speedGaugeSize * 0.4} ${speedGaugeSize * 0.4} 0 0 1 ${speedGaugeSize - 10} ${speedGaugeSize * 0.5}`}
                  fill="none"
                  stroke={getSpeedColor(avgSpeed)}
                  strokeWidth="8"
                  strokeDasharray={`${speedPercent * 157} 157`}
                  className="transition-all duration-500"
                />
                
                {/* Needle */}
                <line
                  x1={speedGaugeSize / 2}
                  y1={speedGaugeSize * 0.5}
                  x2={speedGaugeSize / 2 + Math.cos((speedAngle * Math.PI) / 180) * (speedGaugeSize * 0.35)}
                  y2={speedGaugeSize * 0.5 + Math.sin((speedAngle * Math.PI) / 180) * (speedGaugeSize * 0.35)}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
                
                {/* Center dot */}
                <circle
                  cx={speedGaugeSize / 2}
                  cy={speedGaugeSize * 0.5}
                  r="4"
                  fill="hsl(var(--foreground))"
                />
                
                {/* Scale markers */}
                {[0, 0.25, 0.5, 0.75, 1].map((fraction, index) => {
                  const angle = fraction * 180 - 90;
                  const x1 = speedGaugeSize / 2 + Math.cos((angle * Math.PI) / 180) * (speedGaugeSize * 0.35);
                  const y1 = speedGaugeSize * 0.5 + Math.sin((angle * Math.PI) / 180) * (speedGaugeSize * 0.35);
                  const x2 = speedGaugeSize / 2 + Math.cos((angle * Math.PI) / 180) * (speedGaugeSize * 0.3);
                  const y2 = speedGaugeSize * 0.5 + Math.sin((angle * Math.PI) / 180) * (speedGaugeSize * 0.3);
                  
                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
              
              {/* Quality ring around gauge */}
              {settings.showQualityRing && (
                <svg 
                  width={speedGaugeSize + 10} 
                  height={speedGaugeSize * 0.6 + 5}
                  className="absolute inset-0 -m-1"
                >
                  <circle
                    cx={(speedGaugeSize + 10) / 2}
                    cy={(speedGaugeSize * 0.6 + 5) / 2}
                    r={speedGaugeSize * 0.45}
                    fill="none"
                    stroke={getQualityColor(qualityScore)}
                    strokeWidth="2"
                    strokeDasharray={`${qualityScore * 157} 157`}
                    opacity="0.7"
                  />
                </svg>
              )}
            </div>
            
            <div className="text-center mt-2">
              <div className="text-lg font-mono font-bold">
                {avgSpeed.toFixed(3)} m/s
              </div>
              <div className="text-xs text-muted-foreground">
                Speed
              </div>
            </div>
          </div>

          {/* Compass */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg width={compassSize} height={compassSize}>
                {/* Compass circle */}
                <circle
                  cx={compassSize / 2}
                  cy={compassSize / 2}
                  r={compassSize / 2 - 10}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                />
                
                {/* Cardinal directions */}
                {[
                  { label: 'N', angle: 0 },
                  { label: 'E', angle: 90 },
                  { label: 'S', angle: 180 },
                  { label: 'W', angle: 270 }
                ].map(({ label, angle }) => {
                  const x = compassSize / 2 + Math.sin((angle * Math.PI) / 180) * (compassSize / 2 - 20);
                  const y = compassSize / 2 - Math.cos((angle * Math.PI) / 180) * (compassSize / 2 - 20);
                  
                  return (
                    <text
                      key={label}
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="bold"
                      fill="hsl(var(--foreground))"
                    >
                      {label}
                    </text>
                  );
                })}
                
                {/* Degree markers */}
                {Array.from({ length: 36 }, (_, i) => i * 10).map(angle => {
                  const x1 = compassSize / 2 + Math.sin((angle * Math.PI) / 180) * (compassSize / 2 - 10);
                  const y1 = compassSize / 2 - Math.cos((angle * Math.PI) / 180) * (compassSize / 2 - 10);
                  const x2 = compassSize / 2 + Math.sin((angle * Math.PI) / 180) * (compassSize / 2 - 15);
                  const y2 = compassSize / 2 - Math.cos((angle * Math.PI) / 180) * (compassSize / 2 - 15);
                  
                  return (
                    <line
                      key={angle}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={angle % 30 === 0 ? "2" : "1"}
                      opacity={angle % 30 === 0 ? "1" : "0.5"}
                    />
                  );
                })}
                
                {/* Direction arrow */}
                <g transform={`rotate(${compassAngle} ${compassSize / 2} ${compassSize / 2})`}>
                  <polygon
                    points={`${compassSize / 2},${15} ${compassSize / 2 - 8},${compassSize / 2 - 10} ${compassSize / 2 + 8},${compassSize / 2 - 10}`}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--primary-foreground))"
                    strokeWidth="1"
                  />
                  <line
                    x1={compassSize / 2}
                    y1={compassSize / 2 - 10}
                    x2={compassSize / 2}
                    y2={compassSize / 2 + 20}
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                  />
                </g>
                
                {/* Center dot */}
                <circle
                  cx={compassSize / 2}
                  cy={compassSize / 2}
                  r="4"
                  fill="hsl(var(--foreground))"
                />
              </svg>
            </div>
            
            <div className="text-center mt-2">
              <div className="text-lg font-mono font-bold">
                {avgDirection.toFixed(1)}°
              </div>
              <div className="text-xs text-muted-foreground">
                Direction
              </div>
            </div>
          </div>
        </div>
        
        {/* Quality indicator */}
        {settings.showQualityRing && (
          <div className="text-center mt-2">
            <div className="text-xs text-muted-foreground">
              Quality: <span style={{ color: getQualityColor(qualityScore) }}>
                {(qualityScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}