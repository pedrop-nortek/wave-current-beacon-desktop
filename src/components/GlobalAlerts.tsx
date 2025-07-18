
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';

export const GlobalAlerts: React.FC = () => {
  const { t } = useTranslation();
  const { lastWaveData, alertConfig } = useAppContext();
  const [dismissedAlerts, setDismissedAlerts] = React.useState<string[]>([]);

  const activeAlerts = React.useMemo(() => {
    if (!lastWaveData || !alertConfig.enableAlerts) return [];

    const alerts = [];
    const timestamp = lastWaveData.timestamp.getTime();

    if (lastWaveData.hm0 > alertConfig.hm0Limit) {
      const alertId = `hm0-${timestamp}`;
      if (!dismissedAlerts.includes(alertId)) {
        alerts.push({
          id: alertId,
          type: 'hm0',
          message: `Hm0: ${lastWaveData.hm0.toFixed(2)}m > ${alertConfig.hm0Limit}m`,
          value: lastWaveData.hm0,
          limit: alertConfig.hm0Limit
        });
      }
    }

    if (lastWaveData.hmax > alertConfig.hmaxLimit) {
      const alertId = `hmax-${timestamp}`;
      if (!dismissedAlerts.includes(alertId)) {
        alerts.push({
          id: alertId,
          type: 'hmax',
          message: `Hmax: ${lastWaveData.hmax.toFixed(2)}m > ${alertConfig.hmaxLimit}m`,
          value: lastWaveData.hmax,
          limit: alertConfig.hmaxLimit
        });
      }
    }

    if (lastWaveData.tm02 > alertConfig.tm02Limit) {
      const alertId = `tm02-${timestamp}`;
      if (!dismissedAlerts.includes(alertId)) {
        alerts.push({
          id: alertId,
          type: 'tm02',
          message: `Tm02: ${lastWaveData.tm02.toFixed(2)}s > ${alertConfig.tm02Limit}s`,
          value: lastWaveData.tm02,
          limit: alertConfig.tm02Limit
        });
      }
    }

    return alerts;
  }, [lastWaveData, alertConfig, dismissedAlerts, t]);

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  // Auto-clear dismissed alerts after 30 seconds
  React.useEffect(() => {
    if (dismissedAlerts.length > 0) {
      const timer = setTimeout(() => {
        setDismissedAlerts([]);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [dismissedAlerts]);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 space-y-2 max-w-sm">
      {activeAlerts.map((alert) => (
        <Alert key={alert.id} className="border-red-500 bg-red-50 animate-fade-in">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="flex items-center justify-between">
            <div className="text-red-800">
              <div className="font-semibold">{t('alerts.warning')}</div>
              <div className="text-sm">{alert.message}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dismissAlert(alert.id)}
              className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
