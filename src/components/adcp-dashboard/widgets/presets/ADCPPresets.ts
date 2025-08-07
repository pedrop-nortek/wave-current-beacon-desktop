import { ADCPDashboardLayout } from '@/types/ADCPDashboardTypes';

export const ADCP_PRESETS: Record<string, ADCPDashboardLayout> = {
  operational: {
    id: 'operational',
    name: 'Operational Monitoring',
    description: 'Essential widgets for operational monitoring of ADCP system',
    widgets: [
      {
        id: 'status-main',
        type: 'current-status-table',
        title: 'System Status',
        position: { x: 0, y: 0, w: 4, h: 6 },
        settings: {
          showInstrumentInfo: true,
          showQualityIndicators: true,
          highlightAlerts: true,
          refreshRate: 5
        }
      },
      {
        id: 'current-compass',
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
        id: 'battery-monitor',
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
      },
      {
        id: 'wave-status',
        type: 'wave-status-table',
        title: 'Wave Summary',
        position: { x: 4, y: 4, w: 8, h: 4 },
        settings: {
          showProcessingInfo: true,
          showQualityMetrics: true,
          showCurrentInfo: false,
          compactMode: true
        }
      }
    ],
    gridSettings: {
      cols: 12,
      rowHeight: 60,
      margin: [16, 16],
      compactType: 'vertical' as const
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  scientific: {
    id: 'scientific',
    name: 'Scientific Analysis',
    description: 'Comprehensive data visualization for scientific analysis',
    widgets: [
      {
        id: 'current-hovmoller',
        type: 'current-hovmoller',
        title: 'Current Profile - East Component',
        position: { x: 0, y: 0, w: 6, h: 8 },
        settings: {
          parameter: 'eastVelocity',
          timeRange: '6h',
          colorScheme: 'viridis',
          interpolation: true,
          showColorbar: true
        }
      },
      {
        id: 'current-speed-series',
        type: 'current-timeseries',
        title: 'Profile Mean Speed',
        position: { x: 6, y: 0, w: 6, h: 4 },
        settings: {
          parameter: 'speed',
          timeRange: '24h',
          showGrid: true,
          lineColor: 'hsl(var(--primary))',
          smoothing: true
        }
      },
      {
        id: 'wave-height-series',
        type: 'wave-timeseries',
        title: 'Significant Wave Height',
        position: { x: 6, y: 4, w: 6, h: 4 },
        settings: {
          parameter: 'hm0',
          timeRange: '24h',
          showGrid: true,
          lineColor: 'hsl(var(--chart-2))',
          showAlertThresholds: true
        }
      },
      {
        id: 'comprehensive-status',
        type: 'current-status-table',
        title: 'Detailed Status',
        position: { x: 0, y: 8, w: 12, h: 4 },
        settings: {
          showInstrumentInfo: true,
          showQualityIndicators: true,
          highlightAlerts: true,
          refreshRate: 10
        }
      }
    ],
    gridSettings: {
      cols: 12,
      rowHeight: 60,
      margin: [16, 16],
      compactType: 'vertical' as const
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  mobile: {
    id: 'mobile',
    name: 'Mobile View',
    description: 'Optimized layout for mobile devices',
    widgets: [
      {
        id: 'mobile-status',
        type: 'current-status-table',
        title: 'Status',
        position: { x: 0, y: 0, w: 12, h: 4 },
        settings: {
          showInstrumentInfo: false,
          showQualityIndicators: true,
          highlightAlerts: true,
          refreshRate: 5
        }
      },
      {
        id: 'mobile-gauges',
        type: 'wave-gauge-compass',
        title: 'Current Conditions',
        position: { x: 0, y: 4, w: 12, h: 5 },
        settings: {
          gaugeParameters: ['hm0', 'tp'],
          compassParameter: 'dirTp',
          gaugeSize: 'small',
          showAlertZones: true,
          alertThresholds: {
            hm0: 3.0,
            tp: 12.0
          }
        }
      }
    ],
    gridSettings: {
      cols: 12,
      rowHeight: 60,
      margin: [8, 8],
      compactType: 'vertical' as const
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  presentation: {
    id: 'presentation',
    name: 'Presentation Mode',
    description: 'Clean layout optimized for presentations and displays',
    widgets: [
      {
        id: 'main-gauges',
        type: 'wave-gauge-compass',
        title: 'Wave Conditions',
        position: { x: 0, y: 0, w: 6, h: 6 },
        settings: {
          gaugeParameters: ['hm0', 'hmax', 'tp'],
          compassParameter: 'dirTp',
          gaugeSize: 'large',
          showAlertZones: false,
          alertThresholds: {}
        }
      },
      {
        id: 'current-display',
        type: 'current-speed-compass',
        title: 'Current Data',
        position: { x: 6, y: 0, w: 6, h: 6 },
        settings: {
          speedScale: [0, 3],
          showSpeedHistory: false,
          compassSize: 'large',
          averagingWindow: 30,
          showQualityRing: false
        }
      },
      {
        id: 'wave-trends',
        type: 'wave-timeseries',
        title: 'Wave Height Trend',
        position: { x: 0, y: 6, w: 12, h: 4 },
        settings: {
          parameter: 'hm0',
          timeRange: '24h',
          showGrid: false,
          lineColor: 'hsl(var(--chart-1))',
          showAlertThresholds: false
        }
      }
    ],
    gridSettings: {
      cols: 12,
      rowHeight: 60,
      margin: [20, 20],
      compactType: 'vertical' as const
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
};