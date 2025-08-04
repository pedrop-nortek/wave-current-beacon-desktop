import React, { useMemo } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { WidgetWrapper } from './WidgetWrapper';
import { WidgetPalette } from './WidgetPalette';
import { WidgetConfigurator } from './WidgetConfigurator';
import { useDashboard } from '@/hooks/useDashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Edit, Plus, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function DashboardContainer() {
  const { t } = useTranslation();
  const {
    activeLayout,
    isEditMode,
    selectedWidgetId,
    addWidget,
    removeWidget,
    updateWidget,
    updateLayout,
    toggleEditMode,
    selectWidget
  } = useDashboard();
  
  const [configuringWidgetId, setConfiguringWidgetId] = React.useState<string | null>(null);

  const gridLayouts = useMemo(() => {
    const layout: Layout[] = activeLayout.widgets.map(widget => ({
      i: widget.id,
      x: widget.position.x,
      y: widget.position.y,
      w: widget.position.w,
      h: widget.position.h,
      minW: 2,
      minH: 2,
    }));
    
    return { lg: layout, md: layout, sm: layout, xs: layout, xxs: layout };
  }, [activeLayout.widgets]);

  const handleLayoutChange = (layouts: any) => {
    if (isEditMode && layouts.lg) {
      updateLayout(layouts.lg);
    }
  };

  const handleConfigure = (widgetId: string) => {
    setConfiguringWidgetId(widgetId);
  };

  const handleCloseConfigurator = () => {
    setConfiguringWidgetId(null);
  };

  const configuringWidget = configuringWidgetId 
    ? activeLayout.widgets.find(w => w.id === configuringWidgetId) || null
    : null;

  return (
    <div className="h-full w-full relative">
      {/* Dashboard Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {!isEditMode ? (
          <Button
            onClick={toggleEditMode}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Dashboard
          </Button>
        ) : (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/90 backdrop-blur-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Widget
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-auto p-0">
                <div className="p-4">
                  <WidgetPalette onAddWidget={addWidget} />
                </div>
              </SheetContent>
            </Sheet>
            
            <Button
              onClick={toggleEditMode}
              variant="outline"
              size="sm"
              className="bg-background/90 backdrop-blur-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Done Editing
            </Button>
          </>
        )}
      </div>

      {/* Grid Layout */}
      <div className="h-full w-full p-4">
        {activeLayout.widgets.length === 0 && isEditMode ? (
          <Card className="h-full flex flex-col items-center justify-center p-8 border-dashed border-2">
            <div className="text-center space-y-4">
              <div className="text-muted-foreground">
                <Plus className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Empty Dashboard</h3>
                <p className="text-sm">Click "Add Widget" to start building your dashboard</p>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Widget
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-auto p-0">
                  <div className="p-4">
                    <WidgetPalette onAddWidget={addWidget} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </Card>
        ) : (
          <ResponsiveGridLayout
            className="layout"
            layouts={gridLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={activeLayout.gridSettings.rowHeight}
            margin={activeLayout.gridSettings.margin}
            onLayoutChange={handleLayoutChange}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            useCSSTransforms={true}
            preventCollision={true}
            compactType={null}
            autoSize={true}
          >
            {activeLayout.widgets.map(widget => (
              <div key={widget.id} className="widget-container">
                <WidgetWrapper
                  config={widget}
                  isEditing={isEditMode}
                  isSelected={selectedWidgetId === widget.id}
                  onSelect={selectWidget}
                  onRemove={removeWidget}
                  onConfigure={handleConfigure}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </div>

      {/* Widget Configurator */}
      <WidgetConfigurator
        widget={configuringWidget}
        isOpen={!!configuringWidgetId}
        onClose={handleCloseConfigurator}
        onSave={updateWidget}
      />
    </div>
  );
}