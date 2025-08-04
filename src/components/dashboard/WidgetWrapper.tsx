import React from 'react';
import { WidgetConfig } from '@/types/dashboard';
import { 
  CompassWidget, 
  SpeedometerWidget, 
  TimelineWidget, 
  GaugeWidget, 
  CardWidget 
} from './widgets';
import { WaveDataDisplay } from '@/components/WaveDataDisplay';
import { CurrentDataDisplay } from '@/components/CurrentDataDisplay';
import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WidgetWrapperProps {
  config: WidgetConfig;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onConfigure: (id: string) => void;
}

export function WidgetWrapper({ 
  config, 
  isEditing, 
  isSelected, 
  onSelect, 
  onRemove, 
  onConfigure 
}: WidgetWrapperProps) {
  const renderWidget = () => {
    switch (config.type) {
      case 'compass':
        return <CompassWidget config={config} isEditing={isEditing} />;
      case 'speedometer':
        return <SpeedometerWidget config={config} isEditing={isEditing} />;
      case 'timeline':
        return <TimelineWidget config={config} isEditing={isEditing} />;
      case 'gauge':
        return <GaugeWidget config={config} isEditing={isEditing} />;
      case 'card':
        return <CardWidget config={config} isEditing={isEditing} />;
      case 'hovmoller':
        return <CurrentDataDisplay />;
      default:
        return (
          <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Unknown widget type</span>
          </div>
        );
    }
  };

  return (
    <div 
      className={`relative h-full w-full ${isEditing ? 'cursor-pointer' : ''} ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={isEditing ? () => onSelect(config.id) : undefined}
    >
      {renderWidget()}
      
      {/* Edit mode controls */}
      {isEditing && (
        <div className="absolute top-2 right-2 flex gap-1 bg-background/90 backdrop-blur-sm rounded-md p-1">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onConfigure(config.id);
            }}
            className="h-6 w-6 p-0"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(config.id);
            }}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}