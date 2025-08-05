import { CurrentParameter, WaveParameter } from './NMEATypes';

// Widget Types
export type ADCPWidgetType = 
  | 'current-timeseries'
  | 'current-hovmoller'
  | 'current-status-table'
  | 'current-speed-compass'
  | 'wave-timeseries'
  | 'wave-status-table'
  | 'wave-gauge-compass';

// Widget Configuration
export interface ADCPWidgetConfig {
  id: string;
  type: ADCPWidgetType;
  title: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  settings: ADCPWidgetSettings;
}

// Widget Settings (union type based on widget type)
export type ADCPWidgetSettings = 
  | CurrentTimeSeriesSettings
  | CurrentHovmollerSettings
  | CurrentStatusTableSettings
  | CurrentSpeedCompassSettings
  | WaveTimeSeriesSettings
  | WaveStatusTableSettings
  | WaveGaugeCompassSettings;

// Current Time Series Widget Settings
export interface CurrentTimeSeriesSettings {
  parameter: CurrentParameter;
  timeRange: '1h' | '6h' | '24h' | '7d';
  showGrid: boolean;
  lineColor: string;
  yAxisMin?: number;
  yAxisMax?: number;
  smoothing: boolean;
}

// Current Hovmöller Widget Settings
export interface CurrentHovmollerSettings {
  parameter: CurrentParameter;
  timeRange: '1h' | '6h' | '24h';
  colorScheme: 'viridis' | 'plasma' | 'ocean' | 'rdbu' | 'coolwarm';
  depthRange?: [number, number]; // null = auto
  valueRange?: [number, number]; // null = auto
  interpolation: boolean;
  showColorbar: boolean;
}

// Current Status Table Widget Settings
export interface CurrentStatusTableSettings {
  showInstrumentInfo: boolean;
  showQualityIndicators: boolean;
  highlightAlerts: boolean;
  refreshRate: number; // seconds
}

// Current Speed/Compass Widget Settings
export interface CurrentSpeedCompassSettings {
  speedScale: [number, number]; // [min, max] in m/s
  showSpeedHistory: boolean;
  compassSize: 'small' | 'medium' | 'large';
  averagingWindow: number; // number of samples
  showQualityRing: boolean;
}

// Wave Time Series Widget Settings
export interface WaveTimeSeriesSettings {
  parameter: WaveParameter;
  timeRange: '6h' | '24h' | '7d' | '30d';
  showGrid: boolean;
  lineColor: string;
  yAxisMin?: number;
  yAxisMax?: number;
  showAlertThresholds: boolean;
  alertThreshold?: number;
}

// Wave Status Table Widget Settings
export interface WaveStatusTableSettings {
  showProcessingInfo: boolean;
  showQualityMetrics: boolean;
  showCurrentInfo: boolean;
  compactMode: boolean;
}

// Wave Gauge/Compass Widget Settings
export interface WaveGaugeCompassSettings {
  gaugeParameters: WaveParameter[]; // Which parameters to show as gauges
  compassParameter: 'dirTp' | 'mainDirection';
  gaugeSize: 'small' | 'medium' | 'large';
  showAlertZones: boolean;
  alertThresholds: Record<string, number>;
}

// Dashboard Layout
export interface ADCPDashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: ADCPWidgetConfig[];
  gridSettings: {
    cols: number;
    rowHeight: number;
    margin: [number, number];
    compactType: 'vertical' | 'horizontal' | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard State
export interface ADCPDashboardState {
  layouts: ADCPDashboardLayout[];
  activeLayoutId: string;
  isEditMode: boolean;
  selectedWidgetId: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  dataUpdateRate: number; // Hz
}

// Preset Templates
export interface ADCPDashboardPreset {
  id: string;
  name: string;
  description: string;
  category: 'operational' | 'scientific' | 'mobile' | 'presentation';
  layout: Omit<ADCPDashboardLayout, 'id' | 'createdAt' | 'updatedAt'>;
  thumbnail?: string; // base64 image
}

// Widget Defaults
export const ADCP_WIDGET_DEFAULTS: Record<ADCPWidgetType, { w: number; h: number; minW: number; minH: number }> = {
  'current-timeseries': { w: 6, h: 4, minW: 4, minH: 3 },
  'current-hovmoller': { w: 8, h: 6, minW: 6, minH: 4 },
  'current-status-table': { w: 4, h: 5, minW: 3, minH: 4 },
  'current-speed-compass': { w: 4, h: 4, minW: 3, minH: 3 },
  'wave-timeseries': { w: 6, h: 4, minW: 4, minH: 3 },
  'wave-status-table': { w: 4, h: 4, minW: 3, minH: 3 },
  'wave-gauge-compass': { w: 6, h: 4, minW: 4, minH: 3 }
};

// Color Schemes for Hovmöller plots
export const HOVMOLLER_COLOR_SCHEMES = {
  viridis: ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'],
  plasma: ['#0d0887', '#6a00a8', '#b12a90', '#e16462', '#fca636', '#f0f921'],
  ocean: ['#000080', '#0000ff', '#0080ff', '#00ffff', '#80ff80', '#ffff00'],
  rdbu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
  coolwarm: ['#3b4cc0', '#6a89cc', '#96b7d9', '#c4daea', '#e8f2f7', '#f7f2e8', '#eadac4', '#d9b796', '#cc896a', '#b85450', '#9e2a2b']
};

// Alert configurations
export interface ADCPAlertConfig {
  enabled: boolean;
  waveHeightLimit: number; // Hm0 limit in meters
  currentSpeedLimit: number; // Speed limit in m/s
  batteryLowLimit: number; // Battery voltage limit
  tiltLimit: number; // Instrument tilt limit in degrees
  soundNotifications: boolean;
  emailNotifications?: string[];
}

// Export configuration
export interface ADCPExportConfig {
  format: 'csv' | 'xlsx' | 'json' | 'matlab';
  parameters: (CurrentParameter | WaveParameter)[];
  timeRange: {
    start: Date;
    end: Date;
  };
  includeQualityData: boolean;
  includeMetadata: boolean;
}

// Data quality thresholds
export const DATA_QUALITY_THRESHOLDS = {
  correlation: {
    excellent: 80,
    good: 70,
    fair: 50,
    poor: 0
  },
  amplitude: {
    excellent: 100,
    good: 80,
    fair: 50,
    poor: 0
  },
  tilt: {
    good: 5,    // degrees
    warning: 15,
    critical: 30
  },
  battery: {
    good: 14,   // volts
    warning: 12,
    critical: 10
  }
};