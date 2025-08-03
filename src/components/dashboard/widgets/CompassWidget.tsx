import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WidgetConfig } from '@/types/dashboard';
import { useAppContext } from '@/contexts/AppContext';

interface CompassWidgetProps {
  config: WidgetConfig;
  isEditing?: boolean;
}

export function CompassWidget({ config, isEditing = false }: CompassWidgetProps) {
  const { waveData, currentData } = useAppContext();
  
  const getLatestValue = () => {
    if (config.parameter === 'mdir' && waveData.length > 0) {
      return waveData[waveData.length - 1].mdir;
    }
    if (config.parameter === 'direction' && currentData.length > 0) {
      return currentData[currentData.length - 1].direction;
    }
    return 0;
  };

  const direction = getLatestValue();
  const size = config.settings.size || 'medium';
  
  const compassSize = size === 'small' ? 120 : size === 'large' ? 200 : 160;
  const arrowLength = compassSize * 0.35;
  const centerX = compassSize / 2;
  const centerY = compassSize / 2;
  
  // Convert direction to radians (0° = North, clockwise)
  const angleRad = (direction - 90) * (Math.PI / 180);
  const arrowX = centerX + arrowLength * Math.cos(angleRad);
  const arrowY = centerY + arrowLength * Math.sin(angleRad);

  return (
    <Card className={`h-full ${isEditing ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="relative" style={{ width: compassSize, height: compassSize }}>
          {/* Compass Circle */}
          <svg width={compassSize} height={compassSize} className="absolute inset-0">
            {/* Outer circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={compassSize / 2 - 4}
              fill="hsl(var(--card))"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            
            {/* Inner circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={compassSize / 2 - 20}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="1"
            />
            
            {/* Cardinal directions */}
            {['N', 'E', 'S', 'W'].map((dir, index) => {
              const angle = index * 90;
              const rad = (angle - 90) * (Math.PI / 180);
              const textR = compassSize / 2 - 12;
              const textX = centerX + textR * Math.cos(rad);
              const textY = centerY + textR * Math.sin(rad) + 4;
              
              return (
                <text
                  key={dir}
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  className="text-xs font-medium fill-foreground"
                >
                  {dir}
                </text>
              );
            })}
            
            {/* Degree markers */}
            {Array.from({ length: 36 }, (_, i) => i * 10).map(angle => {
              const rad = (angle - 90) * (Math.PI / 180);
              const outerR = compassSize / 2 - 4;
              const innerR = angle % 30 === 0 ? outerR - 12 : outerR - 6;
              const x1 = centerX + innerR * Math.cos(rad);
              const y1 = centerY + innerR * Math.sin(rad);
              const x2 = centerX + outerR * Math.cos(rad);
              const y2 = centerY + outerR * Math.sin(rad);
              
              return (
                <line
                  key={angle}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--muted))"
                  strokeWidth={angle % 30 === 0 ? "2" : "1"}
                />
              );
            })}
            
            {/* Direction arrow */}
            <g transform={`translate(${centerX}, ${centerY})`}>
              <g transform={`rotate(${direction})`}>
                {/* Arrow shaft */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-arrowLength}
                  stroke="hsl(var(--chart-1))"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
                
                {/* Arrow head definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="0"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="hsl(var(--chart-1))"
                    />
                  </marker>
                </defs>
              </g>
              
              {/* Center dot */}
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="hsl(var(--primary))"
              />
            </g>
          </svg>
        </div>
        
        {/* Direction value display */}
        <div className="mt-2 text-center">
          <div className="text-lg font-bold text-primary">
            {direction.toFixed(0)}°
          </div>
          <div className="text-xs text-muted-foreground">
            {config.parameter === 'mdir' ? 'Wave Dir' : 'Current Dir'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}