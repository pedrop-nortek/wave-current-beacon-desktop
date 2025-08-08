import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Settings, Download, Upload, X } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { 
  ADCPWidgetConfig, 
  ADCPDashboardState, 
  ADCP_WIDGET_DEFAULTS,
  ADCPWidgetType,
  CurrentTimeSeriesSettings,
  CurrentHovmollerSettings,
  CurrentStatusTableSettings,
  CurrentSpeedCompassSettings,
  WaveTimeSeriesSettings,
  WaveStatusTableSettings,
  WaveGaugeCompassSettings
} from '@/types/ADCPDashboardTypes';
import { CurrentTimeSeriesWidget } from './widgets/current/CurrentTimeSeriesWidget';
import { CurrentHovmollerWidget } from './widgets/current/CurrentHovmollerWidget';
import { CurrentStatusTableWidget } from './widgets/current/CurrentStatusTableWidget';
import { CurrentSpeedCompassWidget } from './widgets/current/CurrentSpeedCompassWidget';
import { WaveTimeSeriesWidget } from './widgets/wave/WaveTimeSeriesWidget';
import { WaveStatusTableWidget } from './widgets/wave/WaveStatusTableWidget';
import { WaveGaugeCompassWidget } from './widgets/wave/WaveGaugeCompassWidget';
import { WidgetConfigurator } from './WidgetConfigurator';
import { WidgetPalette } from './WidgetPalette';
import { ADCP_PRESETS } from './widgets/presets/ADCPPresets';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ADCPDashboardProps {
  initialState?: Partial<ADCPDashboardState>;
}

export function ADCPDashboard({ initialState }: ADCPDashboardProps) {
  const [dashboardState, setDashboardState] = useState<ADCPDashboardState>({
    layouts: [],
    activeLayoutId: 'default',
    isEditMode: false,
    selectedWidgetId: null,
    connectionStatus: 'connected',
    dataUpdateRate: 1,
    ...initialState
  });

  const [currentLayout, setCurrentLayout] = useState<string>('operational');
  const [widgets, setWidgets] = useState<ADCPWidgetConfig[]>([]);

  const [configuringWidget, setConfiguringWidget] = useState<ADCPWidgetConfig | null>(null);
  const [showWidgetPalette, setShowWidgetPalette] = useState(false);

  // Load initial preset
  useEffect(() => {
    const preset = ADCP_PRESETS[currentLayout];
    if (preset && widgets.length === 0) {
      setWidgets(preset.widgets);
    }
  }, [currentLayout, widgets.length]);

  const renderWidget = (widget: ADCPWidgetConfig) => {
    const commonProps = {
      id: widget.id,
      isEditing: dashboardState.isEditMode
    };

    switch (widget.type) {
      case 'current-timeseries':
        return <CurrentTimeSeriesWidget {...commonProps} settings={widget.settings as CurrentTimeSeriesSettings} />;
      case 'current-hovmoller':
        return <CurrentHovmollerWidget {...commonProps} settings={widget.settings as CurrentHovmollerSettings} />;
      case 'current-status-table':
        return <CurrentStatusTableWidget {...commonProps} settings={widget.settings as CurrentStatusTableSettings} />;
      case 'current-speed-compass':
        return <CurrentSpeedCompassWidget {...commonProps} settings={widget.settings as CurrentSpeedCompassSettings} />;
      case 'wave-timeseries':
        return <WaveTimeSeriesWidget {...commonProps} settings={widget.settings as WaveTimeSeriesSettings} />;
      case 'wave-status-table':
        return <WaveStatusTableWidget {...commonProps} settings={widget.settings as WaveStatusTableSettings} />;
      case 'wave-gauge-compass':
        return <WaveGaugeCompassWidget {...commonProps} settings={widget.settings as WaveGaugeCompassSettings} />;
      default:
        return (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Settings className="h-8 w-8 mx-auto mb-2" />
              <p>Widget type not implemented</p>
            </div>
          </Card>
        );
    }
  };

  const toggleEditMode = () => {
    setDashboardState(prev => ({
      ...prev,
      isEditMode: !prev.isEditMode,
      selectedWidgetId: null
    }));
  };

  const getDefaultSettings = (type: ADCPWidgetType): any => {
    switch (type) {
      case 'current-timeseries':
        return {
          parameter: 'batteryVoltage',
          timeRange: '6h',
          showGrid: true,
          lineColor: 'hsl(var(--primary))',
          smoothing: true
        };
      case 'current-hovmoller':
        return {
          parameter: 'east',
          timeRange: '6h',
          colorScheme: 'viridis',
          interpolation: true,
          showColorbar: true
        };
      case 'current-status-table':
        return {
          showInstrumentInfo: true,
          showQualityIndicators: true,
          highlightAlerts: true,
          refreshRate: 5
        };
      case 'current-speed-compass':
        return {
          speedScale: [0, 2],
          showSpeedHistory: false,
          compassSize: 'medium',
          averagingWindow: 10,
          showQualityRing: true
        };
      case 'wave-timeseries':
        return {
          parameter: 'hm0',
          timeRange: '24h',
          showGrid: true,
          lineColor: 'hsl(var(--primary))',
          showAlertThresholds: false
        };
      case 'wave-status-table':
        return {
          showProcessingInfo: true,
          showQualityMetrics: true,
          showCurrentInfo: true,
          compactMode: false
        };
      case 'wave-gauge-compass':
        return {
          gaugeParameters: ['hm0', 'tp'],
          compassParameter: 'dirTp',
          gaugeSize: 'medium',
          showAlertZones: false,
          alertThresholds: {}
        };
      default:
        return {};
    }
  };

  const handleAddWidget = (type: ADCPWidgetType) => {
    const defaults = ADCP_WIDGET_DEFAULTS[type];
    const newWidget: ADCPWidgetConfig = {
      id: `widget-${Date.now()}`,
      type,
      title: `New ${type}`,
      position: { 
        x: 0, 
        y: 0, 
        w: defaults.w, 
        h: defaults.h 
      },
      settings: getDefaultSettings(type)
    };
    
    setWidgets(prev => [...prev, newWidget]);
  };

  const handleConfigureWidget = (widget: ADCPWidgetConfig) => {
    setConfiguringWidget(widget);
  };

  const handleSaveWidget = (updatedWidget: ADCPWidgetConfig) => {
    setWidgets(prev => 
      prev.map(w => w.id === updatedWidget.id ? updatedWidget : w)
    );
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const handleLayoutChange = (layout: any[]) => {
    if (dashboardState.isEditMode) {
      const updatedWidgets = widgets.map(widget => {
        const layoutItem = layout.find(l => l.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            position: {
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h
            }
          };
        }
        return widget;
      });
      setWidgets(updatedWidgets);
    }
  };

  const handlePresetChange = (presetId: string) => {
    const preset = ADCP_PRESETS[presetId];
    if (preset) {
      setCurrentLayout(presetId);
      setWidgets(preset.widgets);
      setDashboardState(prev => ({ ...prev, isEditMode: false }));
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">ADCP Dashboard</h1>
          <Select value={currentLayout} onValueChange={handlePresetChange} disabled={dashboardState.isEditMode}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operational">Operational Monitoring</SelectItem>
              <SelectItem value="scientific">Scientific Analysis</SelectItem>
              <SelectItem value="mobile">Mobile View</SelectItem>
              <SelectItem value="presentation">Presentation Mode</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              dashboardState.connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {dashboardState.connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </div>
          {dashboardState.isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWidgetPalette(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Widget
            </Button>
          )}
          <Button
            variant={dashboardState.isEditMode ? "default" : "outline"}
            size="sm"
            onClick={toggleEditMode}
          >
            <Settings className="h-4 w-4 mr-1" />
            {dashboardState.isEditMode ? 'Done' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 p-4 overflow-auto">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: widgets.map(w => ({ i: w.id, ...w.position })) }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          isDraggable={dashboardState.isEditMode}
          isResizable={dashboardState.isEditMode}
          onLayoutChange={handleLayoutChange}
          margin={[16, 16]}
          containerPadding={[0, 0]}
        >
          {widgets.map(widget => (
            <div key={widget.id} className="widget-container">
              <div 
                className={`relative h-full ${dashboardState.isEditMode ? 'cursor-move' : ''}`}
                onDoubleClick={() => !dashboardState.isEditMode ? handleConfigureWidget(widget) : undefined}
              >
                {dashboardState.isEditMode && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfigureWidget(widget);
                      }}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveWidget(widget.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {renderWidget(widget)}
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      {/* Widget Palette */}
      <WidgetPalette
        isOpen={showWidgetPalette}
        onClose={() => setShowWidgetPalette(false)}
        onAddWidget={handleAddWidget}
      />

      {/* Widget Configurator */}
      <WidgetConfigurator
        widget={configuringWidget}
        isOpen={!!configuringWidget}
        onClose={() => setConfiguringWidget(null)}
        onSave={handleSaveWidget}
        onRemove={handleRemoveWidget}
      />
    </div>
  );
}