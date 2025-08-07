
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ConnectionPanel } from '@/components/ConnectionPanel';
import { MeasurementControl } from '@/components/MeasurementControl';
import { WaveDataDisplay } from '@/components/WaveDataDisplay';
import { CurrentDataDisplay } from '@/components/CurrentDataDisplay';
import { AlertsPanel } from '@/components/AlertsPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { LicensePanel } from '@/components/LicensePanel';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeSelector } from '@/components/ThemeSelector';
import { GlobalAlerts } from '@/components/GlobalAlerts';
import { ADCPDashboard } from '@/components/adcp-dashboard/ADCPDashboard';
import { Shield, User } from 'lucide-react';
import '@/utils/i18n';

const AppContent = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Badge variant="default" className="bg-green-500">
                <User className="h-3 w-3 mr-1" />
                {user}
              </Badge>
            )}
            <ThemeSelector />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Global Alerts */}
      <GlobalAlerts />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Connection and Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConnectionPanel />
            <MeasurementControl />
          </div>

          {/* Data Visualization Tabs */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="waves">{t('waves.title')}</TabsTrigger>
              <TabsTrigger value="currents">{t('currents.title')}</TabsTrigger>
              <TabsTrigger value="alerts">{t('alerts.title')}</TabsTrigger>
              <TabsTrigger value="settings">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  {t('settings')}
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="h-[calc(100vh-300px)]">
              <ADCPDashboard />
            </TabsContent>
            
            <TabsContent value="waves">
              <WaveDataDisplay />
            </TabsContent>
            
            <TabsContent value="currents">
              <CurrentDataDisplay />
            </TabsContent>
            
            <TabsContent value="alerts">
              <AlertsPanel />
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExportPanel />
                <LicensePanel />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
};

export default Index;
