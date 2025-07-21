
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, Lock, LogOut, Shield, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from '@/components/LoginDialog';
import { toast } from '@/hooks/use-toast';

export const LicensePanel: React.FC = () => {
  const { t } = useTranslation();
  const { 
    authorizedDevices, 
    addAuthorizedDevice, 
    removeAuthorizedDevice,
    currentDevice 
  } = useAppContext();
  
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [newSerial, setNewSerial] = React.useState('');

  const handleAdd = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    if (!newSerial.trim()) return;
    
    if (authorizedDevices.includes(newSerial.trim())) {
      toast({
        title: t('error'),
        description: t('license.serialExists'),
        variant: 'destructive',
      });
      return;
    }

    addAuthorizedDevice(newSerial.trim());
    setNewSerial('');
    toast({
      title: t('success'),
      description: t('license.deviceAdded'),
    });
  };

  const handleRemove = (serialNumber: string) => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    removeAuthorizedDevice(serialNumber);
    toast({
      title: t('success'),
      description: t('license.deviceRemoved'),
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: t('success'),
      description: t('login.loggedOut'),
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('license.title')}
          </CardTitle>
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">
                {user}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                {t('login.logout')}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dispositivo atual */}
        {currentDevice && (
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">{t('license.connectedDevice')}:</span>
                <span className="ml-2 font-mono">{currentDevice.serialNumber}</span>
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
            
            {!currentDevice.isAuthorized && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t('license.unauthorizedWarning')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Seção de gerenciamento - só aparece se autenticado */}
        {!isAuthenticated && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t('license.loginRequired')}
                </span>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowLoginDialog(true)}
              >
                <Lock className="h-4 w-4 mr-1" />
                {t('login.login')}
              </Button>
            </div>
          </div>
        )}

        {/* Adicionar novo dispositivo - só se autenticado */}
        {isAuthenticated && (
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
        )}

        {/* Lista de dispositivos autorizados */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t('license.authorized')} ({authorizedDevices.length})
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {authorizedDevices.length > 0 ? (
              authorizedDevices.map(serial => (
                <div key={serial} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-mono text-sm">{serial}</span>
                  {isAuthenticated && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(serial)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                {t('license.noDevices')}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
      />
    </Card>
  );
};
