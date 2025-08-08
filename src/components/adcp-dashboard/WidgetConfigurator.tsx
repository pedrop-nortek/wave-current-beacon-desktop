import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  ADCPWidgetConfig, 
  ADCPWidgetType,
  CurrentTimeSeriesSettings,
  CurrentHovmollerSettings,
  CurrentStatusTableSettings,
  CurrentSpeedCompassSettings,
  WaveTimeSeriesSettings,
  WaveStatusTableSettings,
  WaveGaugeCompassSettings
} from '@/types/ADCPDashboardTypes';
import { CURRENT_PARAMETER_META, WAVE_PARAMETER_META } from '@/types/NMEATypes';

interface WidgetConfiguratorProps {
  widget: ADCPWidgetConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (widget: ADCPWidgetConfig) => void;
  onRemove?: (widgetId: string) => void;
}

export function WidgetConfigurator({ widget, isOpen, onClose, onSave, onRemove }: WidgetConfiguratorProps) {
  const [editedWidget, setEditedWidget] = useState<ADCPWidgetConfig | null>(widget);

  // Sync internal state when the incoming widget prop changes
  useEffect(() => {
    setEditedWidget(widget);
  }, [widget]);

  if (!editedWidget) return null;

  const updateSettings = (updates: Partial<any>) => {
    setEditedWidget(prev => prev ? {
      ...prev,
      settings: { ...prev.settings, ...updates }
    } : null);
  };

  const updateWidget = (updates: Partial<ADCPWidgetConfig>) => {
    setEditedWidget(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleSave = () => {
    if (editedWidget) {
      onSave(editedWidget);
      onClose();
    }
  };

  const handleRemove = () => {
    if (editedWidget && onRemove) {
      onRemove(editedWidget.id);
      onClose();
    }
  };

  const renderCurrentTimeSeriesSettings = (settings: CurrentTimeSeriesSettings) => (
    <div className="space-y-4">
      <div>
        <Label>Parameter</Label>
        <Select 
          value={settings.parameter} 
          onValueChange={(value) => updateSettings({ parameter: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CURRENT_PARAMETER_META).map(([key, meta]) => (
              <SelectItem key={key} value={key}>
                {meta.label} ({meta.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Time Range</Label>
        <Select 
          value={settings.timeRange} 
          onValueChange={(value) => updateSettings({ timeRange: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="6h">6 Hours</SelectItem>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Line Color</Label>
        <Input 
          type="color" 
          value={settings.lineColor || '#0ea5e9'} 
          onChange={(e) => updateSettings({ lineColor: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showGrid} 
          onCheckedChange={(checked) => updateSettings({ showGrid: checked })}
        />
        <Label>Show Grid</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.smoothing} 
          onCheckedChange={(checked) => updateSettings({ smoothing: checked })}
        />
        <Label>Smooth Lines</Label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Y-Axis Min</Label>
          <Input 
            type="number" 
            value={settings.yAxisMin || ''} 
            onChange={(e) => updateSettings({ yAxisMin: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>
        <div>
          <Label>Y-Axis Max</Label>
          <Input 
            type="number" 
            value={settings.yAxisMax || ''} 
            onChange={(e) => updateSettings({ yAxisMax: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentHovmollerSettings = (settings: CurrentHovmollerSettings) => (
    <div className="space-y-4">
      <div>
        <Label>Parameter</Label>
        <Select 
          value={settings.parameter} 
          onValueChange={(value) => updateSettings({ parameter: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CURRENT_PARAMETER_META).map(([key, meta]) => (
              <SelectItem key={key} value={key}>
                {meta.label} ({meta.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Time Range</Label>
        <Select 
          value={settings.timeRange} 
          onValueChange={(value) => updateSettings({ timeRange: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="6h">6 Hours</SelectItem>
            <SelectItem value="24h">24 Hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Color Scheme</Label>
        <Select 
          value={settings.colorScheme} 
          onValueChange={(value) => updateSettings({ colorScheme: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viridis">Viridis</SelectItem>
            <SelectItem value="plasma">Plasma</SelectItem>
            <SelectItem value="ocean">Ocean</SelectItem>
            <SelectItem value="rdbu">Red-Blue</SelectItem>
            <SelectItem value="coolwarm">Cool-Warm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.interpolation} 
          onCheckedChange={(checked) => updateSettings({ interpolation: checked })}
        />
        <Label>Interpolation</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showColorbar} 
          onCheckedChange={(checked) => updateSettings({ showColorbar: checked })}
        />
        <Label>Show Colorbar</Label>
      </div>
    </div>
  );

  const renderCurrentStatusTableSettings = (settings: CurrentStatusTableSettings) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showInstrumentInfo} 
          onCheckedChange={(checked) => updateSettings({ showInstrumentInfo: checked })}
        />
        <Label>Show Instrument Info</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showQualityIndicators} 
          onCheckedChange={(checked) => updateSettings({ showQualityIndicators: checked })}
        />
        <Label>Show Quality Indicators</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.highlightAlerts} 
          onCheckedChange={(checked) => updateSettings({ highlightAlerts: checked })}
        />
        <Label>Highlight Alerts</Label>
      </div>

      <div>
        <Label>Refresh Rate (seconds)</Label>
        <Input 
          type="number" 
          value={settings.refreshRate} 
          onChange={(e) => updateSettings({ refreshRate: parseInt(e.target.value) || 5 })}
        />
      </div>
    </div>
  );

  const renderCurrentSpeedCompassSettings = (settings: CurrentSpeedCompassSettings) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Speed Scale Min (m/s)</Label>
          <Input 
            type="number" 
            value={settings.speedScale[0]} 
            onChange={(e) => updateSettings({ 
              speedScale: [parseFloat(e.target.value) || 0, settings.speedScale[1]] 
            })}
          />
        </div>
        <div>
          <Label>Speed Scale Max (m/s)</Label>
          <Input 
            type="number" 
            value={settings.speedScale[1]} 
            onChange={(e) => updateSettings({ 
              speedScale: [settings.speedScale[0], parseFloat(e.target.value) || 2] 
            })}
          />
        </div>
      </div>

      <div>
        <Label>Compass Size</Label>
        <Select 
          value={settings.compassSize} 
          onValueChange={(value) => updateSettings({ compassSize: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Averaging Window (samples)</Label>
        <Input 
          type="number" 
          value={settings.averagingWindow} 
          onChange={(e) => updateSettings({ averagingWindow: parseInt(e.target.value) || 10 })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showSpeedHistory} 
          onCheckedChange={(checked) => updateSettings({ showSpeedHistory: checked })}
        />
        <Label>Show Speed History</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showQualityRing} 
          onCheckedChange={(checked) => updateSettings({ showQualityRing: checked })}
        />
        <Label>Show Quality Ring</Label>
      </div>
    </div>
  );

  const renderWaveTimeSeriesSettings = (settings: WaveTimeSeriesSettings) => (
    <div className="space-y-4">
      <div>
        <Label>Parameter</Label>
        <Select 
          value={settings.parameter} 
          onValueChange={(value) => updateSettings({ parameter: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(WAVE_PARAMETER_META).map(([key, meta]) => (
              <SelectItem key={key} value={key}>
                {meta.label} ({meta.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Time Range</Label>
        <Select 
          value={settings.timeRange} 
          onValueChange={(value) => updateSettings({ timeRange: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6h">6 Hours</SelectItem>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Line Color</Label>
        <Input 
          type="color" 
          value={settings.lineColor || '#0ea5e9'} 
          onChange={(e) => updateSettings({ lineColor: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showGrid} 
          onCheckedChange={(checked) => updateSettings({ showGrid: checked })}
        />
        <Label>Show Grid</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showAlertThresholds} 
          onCheckedChange={(checked) => updateSettings({ showAlertThresholds: checked })}
        />
        <Label>Show Alert Thresholds</Label>
      </div>

      {settings.showAlertThresholds && (
        <div>
          <Label>Alert Threshold</Label>
          <Input 
            type="number" 
            value={settings.alertThreshold || ''} 
            onChange={(e) => updateSettings({ alertThreshold: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>
      )}
    </div>
  );

  const renderWaveStatusTableSettings = (settings: WaveStatusTableSettings) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showProcessingInfo} 
          onCheckedChange={(checked) => updateSettings({ showProcessingInfo: checked })}
        />
        <Label>Show Processing Info</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showQualityMetrics} 
          onCheckedChange={(checked) => updateSettings({ showQualityMetrics: checked })}
        />
        <Label>Show Quality Metrics</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showCurrentInfo} 
          onCheckedChange={(checked) => updateSettings({ showCurrentInfo: checked })}
        />
        <Label>Show Current Info</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.compactMode} 
          onCheckedChange={(checked) => updateSettings({ compactMode: checked })}
        />
        <Label>Compact Mode</Label>
      </div>
    </div>
  );

  const renderWaveGaugeCompassSettings = (settings: WaveGaugeCompassSettings) => (
    <div className="space-y-4">
      <div>
        <Label>Gauge Parameters</Label>
        <div className="space-y-2">
          {Object.entries(WAVE_PARAMETER_META).map(([key, meta]) => (
            <div key={key} className="flex items-center space-x-2">
              <Switch 
                checked={settings.gaugeParameters.includes(key as any)} 
                onCheckedChange={(checked) => {
                  const updated = checked 
                    ? [...settings.gaugeParameters, key]
                    : settings.gaugeParameters.filter(p => p !== key);
                  updateSettings({ gaugeParameters: updated.slice(0, 4) }); // Max 4
                }}
                disabled={!settings.gaugeParameters.includes(key as any) && settings.gaugeParameters.length >= 4}
              />
              <Label>{meta.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Compass Parameter</Label>
        <Select 
          value={settings.compassParameter} 
          onValueChange={(value) => updateSettings({ compassParameter: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dirTp">Peak Direction</SelectItem>
            <SelectItem value="mainDirection">Main Direction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Gauge Size</Label>
        <Select 
          value={settings.gaugeSize} 
          onValueChange={(value) => updateSettings({ gaugeSize: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={settings.showAlertZones} 
          onCheckedChange={(checked) => updateSettings({ showAlertZones: checked })}
        />
        <Label>Show Alert Zones</Label>
      </div>
    </div>
  );

  const renderSettingsForm = () => {
    switch (editedWidget.type) {
      case 'current-timeseries':
        return renderCurrentTimeSeriesSettings(editedWidget.settings as CurrentTimeSeriesSettings);
      case 'current-hovmoller':
        return renderCurrentHovmollerSettings(editedWidget.settings as CurrentHovmollerSettings);
      case 'current-status-table':
        return renderCurrentStatusTableSettings(editedWidget.settings as CurrentStatusTableSettings);
      case 'current-speed-compass':
        return renderCurrentSpeedCompassSettings(editedWidget.settings as CurrentSpeedCompassSettings);
      case 'wave-timeseries':
        return renderWaveTimeSeriesSettings(editedWidget.settings as WaveTimeSeriesSettings);
      case 'wave-status-table':
        return renderWaveStatusTableSettings(editedWidget.settings as WaveStatusTableSettings);
      case 'wave-gauge-compass':
        return renderWaveGaugeCompassSettings(editedWidget.settings as WaveGaugeCompassSettings);
      default:
        return <div>No settings available for this widget type.</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Widget</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Widget Title</Label>
            <Input 
              value={editedWidget.title} 
              onChange={(e) => updateWidget({ title: e.target.value })}
            />
          </div>

          <Separator />

          {renderSettingsForm()}

          <Separator />

          <div className="flex justify-between gap-2">
            <div>
              {onRemove && (
                <Button variant="destructive" onClick={handleRemove}>
                  Remove Widget
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}