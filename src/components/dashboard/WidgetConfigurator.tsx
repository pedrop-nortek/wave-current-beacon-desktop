import React, { useState } from 'react';
import { WidgetConfig, ParameterType, WidgetType } from '@/types/dashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface WidgetConfiguratorProps {
  widget: WidgetConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (widgetId: string, updates: Partial<WidgetConfig>) => void;
}

export function WidgetConfigurator({ 
  widget, 
  isOpen, 
  onClose, 
  onSave 
}: WidgetConfiguratorProps) {
  const [config, setConfig] = useState<Partial<WidgetConfig>>({});

  React.useEffect(() => {
    if (widget) {
      setConfig(widget);
    }
  }, [widget]);

  if (!widget) return null;

  const handleSave = () => {
    onSave(widget.id, config);
    onClose();
  };

  const updateSetting = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  const renderSettingsForType = () => {
    switch (widget.type) {
      case 'speedometer':
      case 'gauge':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minValue">Min Value</Label>
                <Input
                  id="minValue"
                  type="number"
                  value={config.settings?.minValue || 0}
                  onChange={(e) => updateSetting('minValue', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="maxValue">Max Value</Label>
                <Input
                  id="maxValue"
                  type="number"
                  value={config.settings?.maxValue || 100}
                  onChange={(e) => updateSetting('maxValue', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="units">Units</Label>
              <Input
                id="units"
                value={config.settings?.units || ''}
                onChange={(e) => updateSetting('units', e.target.value)}
                placeholder="e.g., m/s, m, °C"
              />
            </div>
            
            <div>
              <Label>Danger Zone Threshold</Label>
              <Slider
                value={[config.settings?.dangerZone || 80]}
                onValueChange={(value) => updateSetting('dangerZone', value[0])}
                max={100}
                min={0}
                step={5}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">
                {config.settings?.dangerZone || 80}% of max value
              </span>
            </div>
          </div>
        );
        
      case 'timeline':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="timeRange">Time Range</Label>
              <Select 
                value={config.settings?.timeRange || '6h'}
                onValueChange={(value) => updateSetting('timeRange', value)}
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
            
            <div className="flex items-center space-x-2">
              <Switch
                id="showHistory"
                checked={config.settings?.showHistory || false}
                onCheckedChange={(checked) => updateSetting('showHistory', checked)}
              />
              <Label htmlFor="showHistory">Show Historical Data</Label>
            </div>
          </div>
        );
        
      case 'hovmoller':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="colorScheme">Color Scheme</Label>
              <Select 
                value={config.settings?.colorScheme || 'viridis'}
                onValueChange={(value) => updateSetting('colorScheme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="thermal">Thermal</SelectItem>
                  <SelectItem value="viridis">Viridis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Depth Layers</Label>
              <Input
                placeholder="e.g., 1,2,3,4,5"
                value={config.settings?.depthLayers?.join(',') || ''}
                onChange={(e) => {
                  const layers = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                  updateSetting('depthLayers', layers);
                }}
              />
              <span className="text-sm text-muted-foreground">
                Comma-separated cell numbers
              </span>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="size">Widget Size</Label>
              <Select 
                value={config.settings?.size || 'medium'}
                onValueChange={(value) => updateSetting('size', value)}
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
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Widget</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Widget Title</Label>
            <Input
              id="title"
              value={config.title || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          {renderSettingsForType()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}