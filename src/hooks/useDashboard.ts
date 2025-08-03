import { useState, useCallback, useMemo } from 'react';
import { DashboardLayout, DashboardState, WidgetConfig, WidgetType, ParameterType, DEFAULT_WIDGET_SIZES } from '@/types/dashboard';

const STORAGE_KEY = 'adcp-dashboard-layouts';

const DEFAULT_LAYOUT: DashboardLayout = {
  id: 'default',
  name: 'Default Layout',
  widgets: [
    {
      id: 'wave-timeline',
      type: 'timeline',
      title: 'Wave Height',
      parameter: 'hm0',
      position: { x: 0, y: 0, w: 8, h: 4 },
      settings: { timeRange: '6h' }
    },
    {
      id: 'wave-direction',
      type: 'compass',
      title: 'Wave Direction',
      parameter: 'mdir',
      position: { x: 8, y: 0, w: 4, h: 4 },
      settings: { size: 'medium' }
    },
    {
      id: 'current-hovmoller',
      type: 'hovmoller',
      title: 'Current Velocity',
      parameter: 'velocity',
      position: { x: 0, y: 4, w: 6, h: 6 },
      settings: { timeRange: '6h' }
    },
    {
      id: 'current-speed',
      type: 'speedometer',
      title: 'Current Speed',
      parameter: 'velocity',
      position: { x: 6, y: 4, w: 4, h: 4 },
      settings: { maxValue: 2, units: 'm/s' }
    }
  ],
  gridSettings: {
    cols: 12,
    rowHeight: 60,
    margin: [16, 16]
  }
};

export function useDashboard() {
  const [dashboardState, setDashboardState] = useState<DashboardState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          layouts: parsed.layouts?.length ? parsed.layouts : [DEFAULT_LAYOUT],
          activeLayoutId: parsed.activeLayoutId || 'default',
          isEditMode: false,
          selectedWidgetId: null
        };
      } catch {
        return {
          layouts: [DEFAULT_LAYOUT],
          activeLayoutId: 'default',
          isEditMode: false,
          selectedWidgetId: null
        };
      }
    }
    return {
      layouts: [DEFAULT_LAYOUT],
      activeLayoutId: 'default',
      isEditMode: false,
      selectedWidgetId: null
    };
  });

  const activeLayout = useMemo(() => 
    dashboardState.layouts.find(l => l.id === dashboardState.activeLayoutId) || dashboardState.layouts[0],
    [dashboardState.layouts, dashboardState.activeLayoutId]
  );

  const saveToDisk = useCallback((state: DashboardState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      layouts: state.layouts,
      activeLayoutId: state.activeLayoutId
    }));
  }, []);

  const addWidget = useCallback((type: WidgetType, parameter: ParameterType) => {
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type,
      title: `${parameter} ${type}`,
      parameter,
      position: {
        x: 0,
        y: 0,
        ...DEFAULT_WIDGET_SIZES[type]
      },
      settings: {}
    };

    setDashboardState(prev => {
      const newLayouts = prev.layouts.map(layout =>
        layout.id === prev.activeLayoutId
          ? { ...layout, widgets: [...layout.widgets, newWidget] }
          : layout
      );
      const newState = { ...prev, layouts: newLayouts };
      saveToDisk(newState);
      return newState;
    });
  }, [saveToDisk]);

  const removeWidget = useCallback((widgetId: string) => {
    setDashboardState(prev => {
      const newLayouts = prev.layouts.map(layout =>
        layout.id === prev.activeLayoutId
          ? { ...layout, widgets: layout.widgets.filter(w => w.id !== widgetId) }
          : layout
      );
      const newState = { 
        ...prev, 
        layouts: newLayouts,
        selectedWidgetId: prev.selectedWidgetId === widgetId ? null : prev.selectedWidgetId
      };
      saveToDisk(newState);
      return newState;
    });
  }, [saveToDisk]);

  const updateWidget = useCallback((widgetId: string, updates: Partial<WidgetConfig>) => {
    setDashboardState(prev => {
      const newLayouts = prev.layouts.map(layout =>
        layout.id === prev.activeLayoutId
          ? {
              ...layout,
              widgets: layout.widgets.map(widget =>
                widget.id === widgetId ? { ...widget, ...updates } : widget
              )
            }
          : layout
      );
      const newState = { ...prev, layouts: newLayouts };
      saveToDisk(newState);
      return newState;
    });
  }, [saveToDisk]);

  const updateLayout = useCallback((positions: Array<{ i: string; x: number; y: number; w: number; h: number }>) => {
    setDashboardState(prev => {
      const newLayouts = prev.layouts.map(layout =>
        layout.id === prev.activeLayoutId
          ? {
              ...layout,
              widgets: layout.widgets.map(widget => {
                const pos = positions.find(p => p.i === widget.id);
                return pos ? { ...widget, position: { x: pos.x, y: pos.y, w: pos.w, h: pos.h } } : widget;
              })
            }
          : layout
      );
      const newState = { ...prev, layouts: newLayouts };
      saveToDisk(newState);
      return newState;
    });
  }, [saveToDisk]);

  const toggleEditMode = useCallback(() => {
    setDashboardState(prev => ({
      ...prev,
      isEditMode: !prev.isEditMode,
      selectedWidgetId: null
    }));
  }, []);

  const selectWidget = useCallback((widgetId: string | null) => {
    setDashboardState(prev => ({
      ...prev,
      selectedWidgetId: widgetId
    }));
  }, []);

  return {
    ...dashboardState,
    activeLayout,
    addWidget,
    removeWidget,
    updateWidget,
    updateLayout,
    toggleEditMode,
    selectWidget
  };
}