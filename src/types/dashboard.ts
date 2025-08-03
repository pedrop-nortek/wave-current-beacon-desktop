export type WidgetType = 
  | 'compass' 
  | 'speedometer' 
  | 'gauge' 
  | 'windrose' 
  | 'timeline' 
  | 'hovmoller' 
  | 'card'
  | 'table';

export type ParameterType = 
  | 'hm0' 
  | 'hmax' 
  | 'mdir' 
  | 'tm02' 
  | 'tp' 
  | 'pressure' 
  | 'temperature' 
  | 'pitch' 
  | 'roll'
  | 'velocity' 
  | 'direction' 
  | 'depth';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  parameter: ParameterType;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  settings: {
    minValue?: number;
    maxValue?: number;
    units?: string;
    colorScheme?: 'default' | 'ocean' | 'thermal' | 'viridis';
    showHistory?: boolean;
    historyLength?: number;
    size?: 'small' | 'medium' | 'large';
    dangerZone?: number;
    showLabels?: boolean;
    depthLayers?: number[];
    timeRange?: '1h' | '6h' | '24h';
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  gridSettings: {
    cols: number;
    rowHeight: number;
    margin: [number, number];
  };
}

export interface DashboardState {
  layouts: DashboardLayout[];
  activeLayoutId: string;
  isEditMode: boolean;
  selectedWidgetId: string | null;
}

export const DEFAULT_WIDGET_SIZES: Record<WidgetType, { w: number; h: number }> = {
  compass: { w: 4, h: 4 },
  speedometer: { w: 4, h: 4 },
  gauge: { w: 3, h: 3 },
  windrose: { w: 6, h: 6 },
  timeline: { w: 8, h: 4 },
  hovmoller: { w: 6, h: 6 },
  card: { w: 3, h: 2 },
  table: { w: 6, h: 4 },
};

export const WIDGET_CATEGORIES = {
  wave: ['hm0', 'hmax', 'mdir', 'tm02', 'tp', 'pressure', 'temperature', 'pitch', 'roll'] as ParameterType[],
  current: ['velocity', 'direction', 'depth'] as ParameterType[],
} as const;