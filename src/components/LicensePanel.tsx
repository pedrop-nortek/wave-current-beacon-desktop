import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

export const LicensePanel: React.FC = () => {
  const { t } = useTranslation();
  const { 
    authorizedDevices, 
    addAuthorizedDevice, 
    removeAuthorizedDevice,
    currentDevice 
  } = useAppContext();

  const [newSerial, setNewSerial] = React.useState('');

  const handleAdd = () => {
    if (!newSerial.trim()) return;
    
    if (authorizedDevices.includes(newSerial.trim())) {
      toast({
        title: t('error'),
        description: 'Número de série já cadastrado',
        variant: 'destructive',
      });
      return;
    }

    addAuthorizedDevice(newSerial.trim());
    setNewSerial('');
    toast({
      title: t('success'),
      description: 'Dispositivo adicionado com sucesso',
    });
  };

  const handleRemove = (serialNumber: string) => {
    removeAuthorizedDevice(serialNumber);
    toast({
      title: t('success'),
      description: 'Dispositivo removido com sucesso',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('license.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dispositivo atual */}
        {currentDevice && (
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Dispositivo Conectado:</span>
                <span className="ml-2">{currentDevice.serialNumber}</span>
              </div>
              <Badge 
                variant={currentDevice.isAuthorized ? "default" : "destructive"}
                className={currentDevice.isAuthorized ? "bg-green-500" : ""}
              >
                {currentDevice.isAuthorized 
                  ? t('license.authorized.message')
                  : t('license.unauthorized')
                }
              </Badge>
            </div>
          </div>
        )}

        {/* Adicionar novo dispositivo */}
        <div className="flex gap-2">
          <Input
            placeholder={t('license.serialNumber')}
            value={newSerial}
            onChange={(e) => setNewSerial(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={!newSerial.trim()}>
            <Plus className="h-4 w-4" />
            {t('license.add')}
          </Button>
        </div>

        {/* Lista de dispositivos autorizados */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t('license.authorized')}
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {authorizedDevices.length > 0 ? (
              authorizedDevices.map(serial => (
                <div key={serial} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-mono text-sm">{serial}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(serial)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                Nenhum dispositivo autorizado
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};