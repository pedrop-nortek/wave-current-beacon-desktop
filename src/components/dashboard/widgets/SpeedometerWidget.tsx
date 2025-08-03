import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WidgetConfig } from '@/types/dashboard';
import { useAppContext } from '@/contexts/AppContext';

interface SpeedometerWidgetProps {
  config: WidgetConfig;
  isEditing?: boolean;
}

export function SpeedometerWidget({ config, isEditing = false }: SpeedometerWidgetProps) {
  const { waveData, currentData } = useAppContext();
  
  const getLatestValue = () => {
    if (config.parameter === 'velocity' && currentData.length > 0) {
      return currentData[currentData.length - 1].velocity;
    }
    if (config.parameter === 'hm0' && waveData.length > 0) {
      return waveData[waveData.length - 1].hm0;
    }
    if (config.parameter === 'hmax' && waveData.length > 0) {
      return waveData[waveData.length - 1].hmax;
    }
    return 0;
  };

  const value = getLatestValue();
  const minValue = config.settings.minValue || 0;
  const maxValue = config.settings.maxValue || (config.parameter === 'velocity' ? 2 : 5);
  const dangerZone = config.settings.dangerZone || maxValue * 0.8;
  const units = config.settings.units || (config.parameter === 'velocity' ? 'm/s' : 'm');
  
  const size = 180;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;
  
  // Arc spans from -135° to 135° (270° total)
  const startAngle = -135;
  const endAngle = 135;
  const totalAngle = endAngle - startAngle;
  
  // Calculate needle angle
  const valueRatio = Math.min(Math.max((value - minValue) / (maxValue - minValue), 0), 1);
  const needleAngle = startAngle + (valueRatio * totalAngle);
  
  // Create arc path
  const createArcPath = (startA: number, endA: number, r: number) => {
    const start = polarToCartesian(centerX, centerY, r, endA);
    const end = polarToCartesian(centerX, centerY, r, startA);
    const largeArcFlag = endA - startA <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };
  
  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  // Color based on value zones
  const getColor = () => {
    if (value >= dangerZone) return 'hsl(var(--destructive))';
    if (value >= maxValue * 0.6) return 'hsl(15 78% 60%)'; // Orange
    return 'hsl(var(--chart-1))';
  };

  return (
    <Card className={`h-full ${isEditing ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="absolute inset-0">
            {/* Background arc */}
            <path
              d={createArcPath(startAngle, endAngle, radius)}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Danger zone arc */}
            {dangerZone < maxValue && (
              <path
                d={createArcPath(
                  startAngle + (dangerZone / maxValue) * totalAngle,
                  endAngle,
                  radius
                )}
                fill="none"
                stroke="hsl(var(--destructive) / 0.3)"
                strokeWidth="12"
                strokeLinecap="round"
              />
            )}
            
            {/* Value arc */}
            <path
              d={createArcPath(startAngle, needleAngle, radius)}
              fill="none"
              stroke={getColor()}
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Scale markings */}
            {Array.from({ length: 11 }, (_, i) => {
              const markValue = minValue + (i / 10) * (maxValue - minValue);
              const markAngle = startAngle + (i / 10) * totalAngle;
              const outerPoint = polarToCartesian(centerX, centerY, radius - 6, markAngle);
              const innerPoint = polarToCartesian(centerX, centerY, radius - 18, markAngle);
              const textPoint = polarToCartesian(centerX, centerY, radius - 30, markAngle);
              
              return (
                <g key={i}>
                  <line
                    x1={outerPoint.x}
                    y1={outerPoint.y}
                    x2={innerPoint.x}
                    y2={innerPoint.y}
                    stroke="hsl(var(--foreground))"
                    strokeWidth="2"
                  />
                  {i % 2 === 0 && (
                    <text
                      x={textPoint.x}
                      y={textPoint.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs fill-muted-foreground"
                    >
                      {markValue.toFixed(0)}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Needle */}
            <g transform={`translate(${centerX}, ${centerY}) rotate(${needleAngle})`}>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={-radius + 25}
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
            
            {/* Center hub */}
            <circle
              cx={centerX}
              cy={centerY}
              r="8"
              fill="hsl(var(--primary))"
            />
          </svg>
        </div>
        
        {/* Value display */}
        <div className="mt-2 text-center">
          <div className="text-2xl font-bold" style={{ color: getColor() }}>
            {value.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">
            {units}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}