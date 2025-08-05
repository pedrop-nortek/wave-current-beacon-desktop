import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Play, Pause } from 'lucide-react';
import { ResponsiveGridLayout } from 'react-grid-layout';
import { ADCPWidgetConfig, ADCPDashboardState, ADCP_WIDGET_DEFAULTS } from '@/types/ADCPDashboardTypes';
import { CurrentTimeSeriesWidget } from './widgets/current/CurrentTimeSeriesWidget';
import { CurrentHovmollerWidget } from './widgets/current/CurrentHovmollerWidget';
import { CurrentStatusTableWidget } from './widgets/current/CurrentStatusTableWidget';
import { CurrentSpeedCompassWidget } from './widgets/current/CurrentSpeedCompassWidget';
import { WaveTimeSeriesWidget } from './widgets/wave/WaveTimeSeriesWidget';

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

  const [widgets, setWidgets] = useState<ADCPWidgetConfig[]>([
    {
      id: 'widget-1',
      type: 'current-status-table',
      title: 'ADCP Status',
      position: { x: 0, y: 0, w: 4, h: 5 },
      settings: {
        showInstrumentInfo: true,
        showQualityIndicators: true,
        highlightAlerts: true,
        refreshRate: 5
      }
    },
    {
      id: 'widget-2',
      type: 'current-speed-compass',
      title: 'Current Speed & Direction',
      position: { x: 4, y: 0, w: 4, h: 4 },
      settings: {
        speedScale: [0, 2],
        showSpeedHistory: false,
        compassSize: 'medium',
        averagingWindow: 10,
        showQualityRing: true
      }
    },
    {
      id: 'widget-3',
      type: 'current-timeseries',
      title: 'Battery Voltage',
      position: { x: 8, y: 0, w: 4, h: 4 },
      settings: {
        parameter: 'batteryVoltage',
        timeRange: '6h',
        showGrid: true,
        lineColor: 'hsl(var(--primary))',
        smoothing: true
      }
    }
  ]);

  const renderWidget = (widget: ADCPWidgetConfig) => {
    const commonProps = {
      id: widget.id,
      isEditing: dashboardState.isEditMode
    };

    switch (widget.type) {
      case 'current-timeseries':
        return <CurrentTimeSeriesWidget {...commonProps} settings={widget.settings} />;
      case 'current-hovmoller':
        return <CurrentHovmollerWidget {...commonProps} settings={widget.settings} />;
      case 'current-status-table':
        return <CurrentStatusTableWidget {...commonProps} settings={widget.settings} />;
      case 'current-speed-compass':
        return <CurrentSpeedCompassWidget {...commonProps} settings={widget.settings} />;
      case 'wave-timeseries':
        return <WaveTimeSeriesWidget {...commonProps} settings={widget.settings} />;
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

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">ADCP Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              dashboardState.connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {dashboardState.connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </div>
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
          margin={[16, 16]}
          containerPadding={[0, 0]}
        >
          {widgets.map(widget => (
            <div key={widget.id} className="widget-container">
              {renderWidget(widget)}
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
}