import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

export const ExportPanel: React.FC = () => {
  const { t } = useTranslation();
  const { exportData } = useAppContext();

  const [filters, setFilters] = React.useState({
    startDate: '',
    endDate: '',
    minHeight: '',
    maxHeight: ''
  });

  const handleExport = async () => {
    try {
      await exportData(filters);
      toast({
        title: t('success'),
        description: t('export.success'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: `Erro ao exportar: ${error}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('export.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('export.startDate')}
            </label>
            <Input
              type="datetime-local"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('export.endDate')}
            </label>
            <Input
              type="datetime-local"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('export.minHeight')}
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="0.0"
              value={filters.minHeight}
              onChange={(e) => setFilters(prev => ({ ...prev, minHeight: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('export.maxHeight')}
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="10.0"
              value={filters.maxHeight}
              onChange={(e) => setFilters(prev => ({ ...prev, maxHeight: e.target.value }))}
            />
          </div>
        </div>

        <Button 
          onClick={handleExport}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {t('export.export')}
        </Button>
      </CardContent>
    </Card>
  );
};