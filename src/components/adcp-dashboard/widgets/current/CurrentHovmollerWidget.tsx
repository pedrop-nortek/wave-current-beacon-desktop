import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useADCPData } from '@/hooks/useADCPData';
import { CURRENT_PARAMETER_META, CurrentParameter } from '@/types/NMEATypes';
import { CurrentHovmollerSettings, HOVMOLLER_COLOR_SCHEMES } from '@/types/ADCPDashboardTypes';
import { useMemo } from 'react';

interface CurrentHovmollerWidgetProps {
  id: string;
  settings: CurrentHovmollerSettings;
  isEditing?: boolean;
}

interface HovmollerCell {
  x: number; // time index
  y: number; // depth
  value: number;
  color: string;
}

export function CurrentHovmollerWidget({ id, settings, isEditing = false }: CurrentHovmollerWidgetProps) {
  const { getHovmollerData } = useADCPData();
  
  // Safety check for parameter metadata
  const parameterMeta = CURRENT_PARAMETER_META[settings.parameter] || {
    label: 'Unknown Parameter',
    unit: '',
    description: 'Unknown parameter',
    range: [0, 1] as [number, number],
    colorScheme: 'sequential' as const,
    decimalPlaces: 2
  };
  
  const data = getHovmollerData(settings.parameter, settings.timeRange);

  const { gridData, timeLabels, depthLabels, colorScale } = useMemo(() => {
    if (data.length === 0) {
      return { gridData: [], timeLabels: [], depthLabels: [], colorScale: [] };
    }

    // Get unique timestamps and depths
    const timestamps = [...new Set(data.map(d => d.timestamp))].sort();
    const depths = [...new Set(data.map(d => d.depth))].sort((a, b) => a - b);

    // Get value range for color scaling
    const values = data.map(d => d.value).filter(v => !isNaN(v));
    const minValue = settings.valueRange?.[0] ?? Math.min(...values);
    const maxValue = settings.valueRange?.[1] ?? Math.max(...values);

    // Color scheme
    const colors = HOVMOLLER_COLOR_SCHEMES[settings.colorScheme] || HOVMOLLER_COLOR_SCHEMES.viridis;
    
    // Create grid
    const cells: HovmollerCell[] = [];
    
    timestamps.forEach((timestamp, timeIndex) => {
      depths.forEach((depth, depthIndex) => {
        const point = data.find(d => d.timestamp === timestamp && Math.abs(d.depth - depth) < 0.1);
        
        if (point) {
          // Normalize value to [0, 1] for color mapping
          let normalizedValue = (point.value - minValue) / (maxValue - minValue);
          normalizedValue = Math.max(0, Math.min(1, normalizedValue));
          
          // Map to color
          const colorIndex = Math.floor(normalizedValue * (colors.length - 1));
          const color = colors[colorIndex];

          cells.push({
            x: timeIndex,
            y: depthIndex,
            value: point.value,
            color
          });
        }
      });
    });

    // Create labels
    const timeLabels = timestamps.map(ts => {
      const date = new Date(ts);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    });

    const depthLabels = depths.map(d => `${d.toFixed(1)}m`);

    // Create color scale for legend
    const colorScale = colors.map((color, index) => ({
      color,
      value: minValue + (index / (colors.length - 1)) * (maxValue - minValue)
    }));

    return { gridData: cells, timeLabels, depthLabels, colorScale };
  }, [data, settings.colorScheme, settings.valueRange]);

  const cellSize = 12; // pixels
  const marginLeft = 60;
  const marginBottom = 40;
  const marginTop = 20;
  const marginRight = settings.showColorbar ? 100 : 20;

  const chartWidth = timeLabels.length * cellSize + marginLeft + marginRight;
  const chartHeight = depthLabels.length * cellSize + marginTop + marginBottom;

  return (
    <Card className={`h-full ${isEditing ? 'ring-2 ring-primary/20' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          {parameterMeta.label} - Depth vs Time
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-full overflow-auto">
          <svg 
            width={chartWidth} 
            height={chartHeight}
            className="border rounded"
            style={{ minWidth: chartWidth, minHeight: chartHeight }}
          >
            {/* Background */}
            <rect 
              x={marginLeft} 
              y={marginTop} 
              width={timeLabels.length * cellSize} 
              height={depthLabels.length * cellSize}
              fill="hsl(var(--background))"
              stroke="hsl(var(--border))"
            />

            {/* Data cells */}
            {gridData.map((cell, index) => (
              <rect
                key={index}
                x={marginLeft + cell.x * cellSize}
                y={marginTop + cell.y * cellSize}
                width={cellSize}
                height={cellSize}
                fill={cell.color}
                stroke="none"
              >
                <title>
                  Time: {timeLabels[cell.x]}, Depth: {depthLabels[cell.y]}, 
                  Value: {cell.value.toFixed(parameterMeta.decimalPlaces)} {parameterMeta.unit}
                </title>
              </rect>
            ))}

            {/* Time axis labels */}
            {timeLabels.map((label, index) => (
              <text
                key={index}
                x={marginLeft + index * cellSize + cellSize / 2}
                y={chartHeight - marginBottom + 15}
                textAnchor="middle"
                fontSize="10"
                fill="hsl(var(--foreground))"
                transform={timeLabels.length > 20 ? 
                  `rotate(-45, ${marginLeft + index * cellSize + cellSize / 2}, ${chartHeight - marginBottom + 15})` : 
                  undefined
                }
              >
                {index % Math.ceil(timeLabels.length / 10) === 0 ? label : ''}
              </text>
            ))}

            {/* Depth axis labels */}
            {depthLabels.map((label, index) => (
              <text
                key={index}
                x={marginLeft - 10}
                y={marginTop + index * cellSize + cellSize / 2 + 3}
                textAnchor="end"
                fontSize="10"
                fill="hsl(var(--foreground))"
              >
                {label}
              </text>
            ))}

            {/* Axis titles */}
            <text
              x={marginLeft + (timeLabels.length * cellSize) / 2}
              y={chartHeight - 5}
              textAnchor="middle"
              fontSize="12"
              fill="hsl(var(--foreground))"
              fontWeight="bold"
            >
              Time
            </text>

            <text
              x={15}
              y={marginTop + (depthLabels.length * cellSize) / 2}
              textAnchor="middle"
              fontSize="12"
              fill="hsl(var(--foreground))"
              fontWeight="bold"
              transform={`rotate(-90, 15, ${marginTop + (depthLabels.length * cellSize) / 2})`}
            >
              Depth (m)
            </text>

            {/* Color bar */}
            {settings.showColorbar && colorScale.length > 0 && (
              <g>
                <text
                  x={chartWidth - marginRight + 10}
                  y={marginTop - 5}
                  fontSize="10"
                  fill="hsl(var(--foreground))"
                  fontWeight="bold"
                >
                  {parameterMeta.unit}
                </text>
                {colorScale.map((item, index) => (
                  <g key={index}>
                    <rect
                      x={chartWidth - marginRight + 10}
                      y={marginTop + index * (depthLabels.length * cellSize / colorScale.length)}
                      width={20}
                      height={depthLabels.length * cellSize / colorScale.length}
                      fill={item.color}
                    />
                    {index % Math.ceil(colorScale.length / 5) === 0 && (
                      <text
                        x={chartWidth - marginRight + 35}
                        y={marginTop + index * (depthLabels.length * cellSize / colorScale.length) + 10}
                        fontSize="9"
                        fill="hsl(var(--foreground))"
                      >
                        {item.value.toFixed(parameterMeta.decimalPlaces)}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            )}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}