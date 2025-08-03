import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { WidgetType, ParameterType, WIDGET_CATEGORIES } from '@/types/dashboard';
import { 
  Compass, 
  Gauge, 
  TrendingUp, 
  Grid3x3, 
  Wind, 
  CreditCard,
  Table 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WidgetPaletteProps {
  onAddWidget: (type: WidgetType, parameter: ParameterType) => void;
}

const WIDGET_ICONS: Record<WidgetType, React.ComponentType<any>> = {
  compass: Compass,
  speedometer: Gauge,
  gauge: Gauge,
  windrose: Wind,
  timeline: TrendingUp,
  hovmoller: Grid3x3,
  card: CreditCard,
  table: Table,
};

const WIDGET_DESCRIPTIONS: Record<WidgetType, string> = {
  compass: 'Circular direction indicator',
  speedometer: 'Arc-style gauge with zones',
  gauge: 'Simple circular gauge',
  windrose: 'Multi-directional wind/current rose',
  timeline: 'Time series line chart',
  hovmoller: 'Time vs depth heatmap',
  card: 'Simple value display card',
  table: 'Data table view',
};

export function WidgetPalette({ onAddWidget }: WidgetPaletteProps) {
  const { t } = useTranslation();

  const handleAddWidget = (type: WidgetType, parameter: ParameterType) => {
    onAddWidget(type, parameter);
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Widget Palette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wave Parameters */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Badge variant="secondary">Wave</Badge>
            Parameters
          </h4>
          <div className="space-y-2">
            {WIDGET_CATEGORIES.wave.slice(0, 4).map(param => (
              <div key={param} className="space-y-1">
                <div className="text-xs text-muted-foreground capitalize">{param}</div>
                <div className="flex flex-wrap gap-1">
                  {(['compass', 'speedometer', 'timeline', 'card'] as WidgetType[])
                    .filter(type => 
                      (param === 'mdir' && ['compass', 'card'].includes(type)) ||
                      (['hm0', 'hmax', 'tm02', 'tp'].includes(param) && ['speedometer', 'timeline', 'card'].includes(type))
                    )
                    .map(type => {
                      const Icon = WIDGET_ICONS[type];
                      return (
                        <Button
                          key={`${type}-${param}`}
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleAddWidget(type, param)}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {type}
                        </Button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Current Parameters */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Badge variant="secondary">Current</Badge>
            Parameters
          </h4>
          <div className="space-y-2">
            {WIDGET_CATEGORIES.current.map(param => (
              <div key={param} className="space-y-1">
                <div className="text-xs text-muted-foreground capitalize">{param}</div>
                <div className="flex flex-wrap gap-1">
                  {(['compass', 'speedometer', 'hovmoller', 'card'] as WidgetType[])
                    .filter(type => 
                      (param === 'direction' && ['compass', 'windrose', 'card'].includes(type)) ||
                      (param === 'velocity' && ['speedometer', 'hovmoller', 'card'].includes(type)) ||
                      (param === 'depth' && ['card', 'table'].includes(type))
                    )
                    .map(type => {
                      const Icon = WIDGET_ICONS[type];
                      return (
                        <Button
                          key={`${type}-${param}`}
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleAddWidget(type, param)}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {type}
                        </Button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Quick Add Popular Widgets */}
        <div>
          <h4 className="text-sm font-medium mb-2">Quick Add</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddWidget('compass', 'mdir')}
              className="h-12 flex-col gap-1"
            >
              <Compass className="h-4 w-4" />
              <span className="text-xs">Wave Dir</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddWidget('speedometer', 'velocity')}
              className="h-12 flex-col gap-1"
            >
              <Gauge className="h-4 w-4" />
              <span className="text-xs">Current</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddWidget('timeline', 'hm0')}
              className="h-12 flex-col gap-1"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Wave Height</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddWidget('hovmoller', 'velocity')}
              className="h-12 flex-col gap-1"
            >
              <Grid3x3 className="h-4 w-4" />
              <span className="text-xs">Hovmöller</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}