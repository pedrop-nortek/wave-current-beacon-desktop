import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppProvider } from '@/contexts/AppContext';
import { ConnectionPanel } from '@/components/ConnectionPanel';
import { MeasurementControl } from '@/components/MeasurementControl';
import { WaveDataDisplay } from '@/components/WaveDataDisplay';
import { CurrentDataDisplay } from '@/components/CurrentDataDisplay';
import { AlertsPanel } from '@/components/AlertsPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { LicensePanel } from '@/components/LicensePanel';
import { LanguageSelector } from '@/components/LanguageSelector';
import '@/utils/i18n';

const Index = () => {
  const { t } = useTranslation();

  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t('app.title')}</h1>
            <LanguageSelector />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Connection and Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConnectionPanel />
              <MeasurementControl />
            </div>

            {/* Data Visualization Tabs */}
            <Tabs defaultValue="waves" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="waves">{t('waves.title')}</TabsTrigger>
                <TabsTrigger value="currents">{t('currents.title')}</TabsTrigger>
                <TabsTrigger value="alerts">{t('alerts.title')}</TabsTrigger>
                <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
              </TabsList>
              
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
    </AppProvider>
  );
};

export default Index;