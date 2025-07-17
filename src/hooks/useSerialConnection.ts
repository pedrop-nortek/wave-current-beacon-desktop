import { useState, useCallback, useRef } from 'react';

export interface SerialConfig {
  port: string;
  baudRate: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export const useSerialConnection = () => {
  const [config, setConfig] = useState<SerialConfig>({
    port: '',
    baudRate: 115200
  });
  
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isConnecting: false,
    error: null
  });

  const [availablePorts, setAvailablePorts] = useState<string[]>([]);
  const portRef = useRef<any>(null);

  const listPorts = useCallback(async () => {
    try {
      // Em ambiente Electron, isso seria implementado com serialport
      // Para demonstração, simularemos portas disponíveis
      const mockPorts = ['COM1', 'COM3', 'COM4', 'COM8'];
      setAvailablePorts(mockPorts);
      return mockPorts;
    } catch (error) {
      console.error('Error listing ports:', error);
      return [];
    }
  }, []);

  const connect = useCallback(async () => {
    if (!config.port) {
      setStatus(prev => ({ ...prev, error: 'Por favor, selecione uma porta' }));
      return false;
    }

    setStatus({ isConnected: false, isConnecting: true, error: null });
    
    try {
      // Simulação da conexão serial
      // Em ambiente real Electron, usaria: const SerialPort = require('serialport')
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({ isConnected: true, isConnecting: false, error: null });
      return true;
    } catch (error) {
      setStatus({ 
        isConnected: false, 
        isConnecting: false, 
        error: `Erro ao conectar: ${error}` 
      });
      return false;
    }
  }, [config]);

  const disconnect = useCallback(async () => {
    try {
      if (portRef.current) {
        // portRef.current.close();
        portRef.current = null;
      }
      setStatus({ isConnected: false, isConnecting: false, error: null });
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }, []);

  const sendCommand = useCallback(async (command: string) => {
    if (!status.isConnected) {
      throw new Error('Não conectado ao equipamento');
    }
    
    try {
      // Simulação do envio de comando
      console.log(`Sending command: ${command}`);
      // Em ambiente real: portRef.current.write(command);
      return true;
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }, [status.isConnected]);

  return {
    config,
    setConfig,
    status,
    availablePorts,
    listPorts,
    connect,
    disconnect,
    sendCommand
  };
};