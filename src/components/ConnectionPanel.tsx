import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useSerialConnection } from '@/hooks/useSerialConnection';

const BAUD_RATES = [9600, 19200, 38400, 57600, 115200];

export const ConnectionPanel: React.FC = () => {
  const { t } = useTranslation();
  const {
    config,
    setConfig,
    status,
    availablePorts,
    listPorts,
    connect,
    disconnect
  } = useSerialConnection();

  React.useEffect(() => {
    listPorts();
  }, [listPorts]);

  const handleConnect = () => {
    if (status.isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.isConnected ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          {t('connection.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('connection.port')}
            </label>
            <div className="flex gap-2">
              <Select
                value={config.port}
                onValueChange={(value) => setConfig(prev => ({ ...prev, port: value }))}
                disabled={status.isConnected}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('connection.selectPort')} />
                </SelectTrigger>
                <SelectContent>
                  {availablePorts.map(port => (
                    <SelectItem key={port} value={port}>
                      {port}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={listPorts}
                disabled={status.isConnected}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('connection.baudrate')}
            </label>
            <Select
              value={config.baudRate.toString()}
              onValueChange={(value) => setConfig(prev => ({ ...prev, baudRate: parseInt(value) }))}
              disabled={status.isConnected}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BAUD_RATES.map(rate => (
                  <SelectItem key={rate} value={rate.toString()}>
                    {rate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge 
            variant={status.isConnected ? "default" : "secondary"}
            className={status.isConnected ? "bg-green-500" : ""}
          >
            {status.isConnecting 
              ? t('connection.connecting')
              : status.isConnected 
                ? t('connection.connected')
                : t('connection.disconnected')
            }
          </Badge>

          <Button
            onClick={handleConnect}
            disabled={status.isConnecting || !config.port}
            variant={status.isConnected ? "destructive" : "default"}
          >
            {status.isConnecting 
              ? t('connection.connecting')
              : status.isConnected 
                ? t('connection.disconnect')
                : t('connection.connect')
            }
          </Button>
        </div>

        {status.error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {status.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};