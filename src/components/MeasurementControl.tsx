import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Loader2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useSerialConnection } from '@/hooks/useSerialConnection';
import { INITIALIZATION_COMMANDS } from '@/types/adcp';

export const MeasurementControl: React.FC = () => {
  const { t } = useTranslation();
  const { measurementState, updateMeasurementState } = useAppContext();
  const { status: connectionStatus, sendCommand } = useSerialConnection();

  const startMeasurement = async () => {
    if (!connectionStatus.isConnected) {
      return;
    }

    updateMeasurementState({ 
      isInitializing: true, 
      error: null 
    });

    try {
      // Enviar comandos de inicialização com delays
      for (let i = 0; i < INITIALIZATION_COMMANDS.length; i++) {
        const command = INITIALIZATION_COMMANDS[i];
        
        if (i === 0) {
          // Comando de break - sem delay
          await sendCommand(command);
        } else if (i === 1) {
          // Primeiro K1W%!Q\r\n - 150ms delay
          await new Promise(resolve => setTimeout(resolve, 150));
          await sendCommand(command);
        } else if (i === 2) {
          // Segundo K1W%!Q\r\n - 1000ms delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          await sendCommand(command);
        } else {
          // Demais comandos - 1500ms delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          await sendCommand(command);
        }
      }

      updateMeasurementState({
        isInitializing: false,
        isRunning: true,
        startTime: new Date(),
        error: null
      });

      // Iniciar simulação de recepção de dados
      startDataSimulation();

    } catch (error) {
      updateMeasurementState({
        isInitializing: false,
        isRunning: false,
        error: `Erro na inicialização: ${error}`
      });
    }
  };

  const stopMeasurement = () => {
    updateMeasurementState({
      isRunning: false,
      isInitializing: false,
      startTime: null,
      error: null
    });
  };

  // Simulação de dados para demonstração
  const startDataSimulation = () => {
    const { addWaveData, addCurrentData } = useAppContext();
    
    // Simular dados de onda a cada 1 segundo
    const waveInterval = setInterval(() => {
      if (!measurementState.isRunning) {
        clearInterval(waveInterval);
        return;
      }

      const waveData = {
        hm0: 1.5 + Math.random() * 2,
        hmax: 2.5 + Math.random() * 3,
        mdir: Math.random() * 360,
        tm02: 6 + Math.random() * 4,
        tp: 8 + Math.random() * 6,
        pressure: 1013 + Math.random() * 20,
        temperature: 18 + Math.random() * 8,
        pitch: -2 + Math.random() * 4,
        roll: -1 + Math.random() * 2,
        timestamp: new Date()
      };

      addWaveData(waveData);
    }, 1000);

    // Simular dados de corrente
    const currentInterval = setInterval(() => {
      if (!measurementState.isRunning) {
        clearInterval(currentInterval);
        return;
      }

      for (let cell = 1; cell <= 30; cell++) {
        const currentData = {
          cellNumber: cell,
          depth: cell * 0.3, // Célula de 30cm
          velocity: Math.random() * 0.5,
          direction: Math.random() * 360,
          timestamp: new Date()
        };

        addCurrentData(currentData);
      }
    }, 1000);
  };

  const canStart = connectionStatus.isConnected && !measurementState.isRunning && !measurementState.isInitializing;
  const canStop = measurementState.isRunning || measurementState.isInitializing;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('measurement.status')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge 
            variant={measurementState.isRunning ? "default" : "secondary"}
            className={measurementState.isRunning ? "bg-green-500" : ""}
          >
            {measurementState.isInitializing 
              ? t('measurement.initializing')
              : measurementState.isRunning 
                ? t('measurement.running')
                : t('measurement.stopped')
            }
          </Badge>

          <div className="flex gap-2">
            <Button
              onClick={startMeasurement}
              disabled={!canStart}
              className="bg-green-600 hover:bg-green-700"
            >
              {measurementState.isInitializing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {t('measurement.start')}
            </Button>

            <Button
              onClick={stopMeasurement}
              disabled={!canStop}
              variant="destructive"
            >
              <Square className="h-4 w-4 mr-2" />
              {t('measurement.stop')}
            </Button>
          </div>
        </div>

        {measurementState.startTime && (
          <div className="text-sm text-muted-foreground">
            Início: {measurementState.startTime.toLocaleString()}
          </div>
        )}

        {measurementState.error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {measurementState.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};