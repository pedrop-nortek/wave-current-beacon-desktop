import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Activity, 
  Table2, 
  Compass, 
  BarChart3,
  Gauge
} from 'lucide-react';
import { ADCPWidgetType, ADCP_WIDGET_DEFAULTS } from '@/types/ADCPDashboardTypes';

interface WidgetPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: ADCPWidgetType) => void;
}

interface WidgetTemplate {
  type: ADCPWidgetType;
  name: string;
  description: string;
  category: 'current' | 'wave';
  icon: React.ComponentType<{ className?: string }>;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    type: 'current-timeseries',
    name: 'Current Time Series',
    description: 'Display current sensor parameters over time (battery, heading, pitch, roll, etc.)',
    category: 'current',
    icon: LineChart,
    complexity: 'basic'
  },
  {
    type: 'current-hovmoller',
    name: 'Current Hovmöller',
    description: 'Show current profile data vs time and depth with color-coded values',
    category: 'current',
    icon: Activity,
    complexity: 'advanced'
  },
  {
    type: 'current-status-table',
    name: 'Current Status Table',
    description: 'Summary table of latest current measurements and instrument status',
    category: 'current',
    icon: Table2,
    complexity: 'basic'
  },
  {
    type: 'current-speed-compass',
    name: 'Current Speed & Compass',
    description: 'Combined speedometer and compass for current velocity and direction',
    category: 'current',
    icon: Compass,
    complexity: 'intermediate'
  },
  {
    type: 'wave-timeseries',
    name: 'Wave Time Series',
    description: 'Display wave parameters over time (Hm0, Tp, wave direction, etc.)',
    category: 'wave',
    icon: BarChart3,
    complexity: 'basic'
  },
  {
    type: 'wave-status-table',
    name: 'Wave Status Table',
    description: 'Comprehensive table of latest wave measurements and quality metrics',
    category: 'wave',
    icon: Table2,
    complexity: 'basic'
  },
  {
    type: 'wave-gauge-compass',
    name: 'Wave Gauges & Compass',
    description: 'Circular gauges for wave heights/periods and compass for wave direction',
    category: 'wave',
    icon: Gauge,
    complexity: 'intermediate'
  }
];

export function WidgetPalette({ isOpen, onClose, onAddWidget }: WidgetPaletteProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCurrentWidgets = () => WIDGET_TEMPLATES.filter(w => w.category === 'current');
  const getWaveWidgets = () => WIDGET_TEMPLATES.filter(w => w.category === 'wave');

  const handleAddWidget = (type: ADCPWidgetType) => {
    onAddWidget(type);
    onClose();
  };

  const renderWidgetCard = (template: WidgetTemplate) => {
    const Icon = template.icon;
    const defaults = ADCP_WIDGET_DEFAULTS[template.type];
    
    return (
      <Card 
        key={template.type} 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleAddWidget(template.type)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm">{template.name}</CardTitle>
            </div>
            <Badge className={`text-xs ${getComplexityColor(template.complexity)}`}>
              {template.complexity}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {template.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Size: {defaults.w}×{defaults.h}</span>
            <Button size="sm" variant="outline">
              Add Widget
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Widgets */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold">Current Data Widgets</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getCurrentWidgets().map(renderWidgetCard)}
            </div>
          </div>

          {/* Wave Widgets */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold">Wave Data Widgets</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getWaveWidgets().map(renderWidgetCard)}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Widget Usage Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Basic</strong> widgets are simple to configure and ideal for quick monitoring</li>
              <li>• <strong>Intermediate</strong> widgets offer more customization options</li>
              <li>• <strong>Advanced</strong> widgets provide detailed scientific visualization</li>
              <li>• Click any widget to add it to your dashboard</li>
              <li>• You can configure each widget after adding it</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}