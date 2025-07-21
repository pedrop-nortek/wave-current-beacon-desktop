import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

export const AlertsPanel: React.FC = () => {
  const { t } = useTranslation();
  const { alertConfig, updateAlertConfig, lastWaveData } = useAppContext();

  const [localConfig, setLocalConfig] = React.useState(alertConfig);

  React.useEffect(() => {
    setLocalConfig(alertConfig);
  }, [alertConfig]);

  const handleSave = () => {
    updateAlertConfig(localConfig);
  };

  // Verificar se há alertas ativos
  const activeAlerts = React.useMemo(() => {
    if (!lastWaveData || !alertConfig.enableAlerts) return [];
    
    const alerts = [];
    if (lastWaveData.hm0 > alertConfig.hm0Limit) {
      alerts.push(`Hm0: ${lastWaveData.hm0.toFixed(2)}m > ${alertConfig.hm0Limit}m`);
    }
    if (lastWaveData.hmax > alertConfig.hmaxLimit) {
      alerts.push(`Hmax: ${lastWaveData.hmax.toFixed(2)}m > ${alertConfig.hmaxLimit}m`);
    }
    if (lastWaveData.tm02 > alertConfig.tm02Limit) {
      alerts.push(`Tm02: ${lastWaveData.tm02.toFixed(2)}s > ${alertConfig.tm02Limit}s`);
    }
    return alerts;
  }, [lastWaveData, alertConfig]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('alerts.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alertas ativos */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            {activeAlerts.map((alert, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t('alerts.warning')} {alert}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Configurações */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={localConfig.enableAlerts}
              onCheckedChange={(checked) => 
                setLocalConfig(prev => ({ ...prev, enableAlerts: checked }))
              }
            />
            <label className="text-sm font-medium">
              {t('alerts.enableAlerts')}
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={localConfig.enableAlertSound}
              onCheckedChange={(checked) => 
                setLocalConfig(prev => ({ ...prev, enableAlertSound: checked }))
              }
              disabled={!localConfig.enableAlerts}
            />
            <label className="text-sm font-medium">
              {t('alerts.enableSound')}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('alerts.hm0Limit')}
              </label>
              <Input
                type="number"
                step="0.1"
                value={localConfig.hm0Limit}
                onChange={(e) => 
                  setLocalConfig(prev => ({ 
                    ...prev, 
                    hm0Limit: parseFloat(e.target.value) || 0 
                  }))
                }
                disabled={!localConfig.enableAlerts}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('alerts.hmaxLimit')}
              </label>
              <Input
                type="number"
                step="0.1"
                value={localConfig.hmaxLimit}
                onChange={(e) => 
                  setLocalConfig(prev => ({ 
                    ...prev, 
                    hmaxLimit: parseFloat(e.target.value) || 0 
                  }))
                }
                disabled={!localConfig.enableAlerts}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('alerts.tm02Limit')}
              </label>
              <Input
                type="number"
                step="0.1"
                value={localConfig.tm02Limit}
                onChange={(e) => 
                  setLocalConfig(prev => ({ 
                    ...prev, 
                    tm02Limit: parseFloat(e.target.value) || 0 
                  }))
                }
                disabled={!localConfig.enableAlerts}
              />
            </div>
          </div>

          <Button 
            onClick={handleSave}
            className="w-full"
          >
            {t('save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};