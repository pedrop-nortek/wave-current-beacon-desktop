import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { WaveData, CurrentData, AlertConfig, MeasurementState, ADCPConfig } from '@/types/adcp';

export interface SerialConfig {
  port: string;
  baudRate: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface AppContextType {
  // Data
  waveData: WaveData[];
  currentData: CurrentData[];
  lastWaveData: WaveData | null;
  
  // State
  measurementState: MeasurementState;
  alertConfig: AlertConfig;
  authorizedDevices: string[];
  currentDevice: ADCPConfig | null;
  
  // Serial Connection
  serialConfig: SerialConfig;
  connectionStatus: ConnectionStatus;
  availablePorts: string[];
  
  // Actions
  addWaveData: (data: WaveData) => void;
  addCurrentData: (data: CurrentData) => void;
  updateMeasurementState: (state: Partial<MeasurementState>) => void;
  updateAlertConfig: (config: Partial<AlertConfig>) => void;
  addAuthorizedDevice: (serialNumber: string) => void;
  removeAuthorizedDevice: (serialNumber: string) => void;
  setCurrentDevice: (device: ADCPConfig | null) => void;
  clearData: () => void;
  exportData: (filters?: any) => void;
  
  // Serial Actions
  setSerialConfig: (config: Partial<SerialConfig>) => void;
  listPorts: () => Promise<string[]>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  sendCommand: (command: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('useAppContext called outside of AppProvider. Component hierarchy:', new Error().stack);
    throw new Error('useAppContext deve ser usado dentro de AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [waveData, setWaveData] = useState<WaveData[]>([]);
  const [currentData, setCurrentData] = useState<CurrentData[]>([]);
  const [lastWaveData, setLastWaveData] = useState<WaveData | null>(null);
  
  const [measurementState, setMeasurementState] = useState<MeasurementState>({
    isRunning: false,
    isInitializing: false,
    startTime: null,
    error: null
  });
  
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    hm0Limit: 3.0,
    hmaxLimit: 5.0,
    tm02Limit: 10.0,
    enableAlerts: true
  });
  
  const [authorizedDevices, setAuthorizedDevices] = useState<string[]>([
    'ADCP001', 'ADCP002' // Dispositivos demo
  ]);
  
  const [currentDevice, setCurrentDevice] = useState<ADCPConfig | null>(null);
  
  // Serial Connection State
  const [serialConfig, setSerialConfigState] = useState<SerialConfig>({
    port: '',
    baudRate: 115200
  });
  
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isConnecting: false,
    error: null
  });

  const [availablePorts, setAvailablePorts] = useState<string[]>([]);
  const portRef = useRef<any>(null);
  
  const dataBufferRef = useRef<{ waves: WaveData[], currents: CurrentData[] }>({
    waves: [],
    currents: []
  });

  // Data simulation intervals
  const intervalsRef = useRef<{ wave?: NodeJS.Timeout, current?: NodeJS.Timeout }>({});
  
  // Current data time tracking
  const currentDataTimeRef = useRef<number>(Date.now());

  const addWaveData = useCallback((data: WaveData) => {
    console.log('Adding wave data:', data);
    setWaveData(prev => {
      const newData = [...prev, data].slice(-1000); // Manter últimos 1000 pontos
      dataBufferRef.current.waves.push(data);
      return newData;
    });
    setLastWaveData(data);
    
    // Verificar alertas
    if (alertConfig.enableAlerts) {
      const alerts = [];
      if (data.hm0 > alertConfig.hm0Limit) alerts.push(`Hm0: ${data.hm0.toFixed(2)}m`);
      if (data.hmax > alertConfig.hmaxLimit) alerts.push(`Hmax: ${data.hmax.toFixed(2)}m`);
      if (data.tm02 > alertConfig.tm02Limit) alerts.push(`Tm02: ${data.tm02.toFixed(2)}s`);
      
      if (alerts.length > 0) {
        console.warn('ALERTA:', alerts.join(', '));
      }
    }
  }, [alertConfig]);

  const addCurrentData = useCallback((data: CurrentData) => {
    setCurrentData(prev => {
      const newData = [...prev, data].slice(-5000); // Manter últimos 5000 pontos
      dataBufferRef.current.currents.push(data);
      return newData;
    });
  }, []);

  const updateMeasurementState = useCallback((state: Partial<MeasurementState>) => {
    console.log('Updating measurement state:', state);
    setMeasurementState(prev => ({ ...prev, ...state }));
  }, []);

  const updateAlertConfig = useCallback((config: Partial<AlertConfig>) => {
    setAlertConfig(prev => ({ ...prev, ...config }));
  }, []);

  const addAuthorizedDevice = useCallback((serialNumber: string) => {
    setAuthorizedDevices(prev => [...prev, serialNumber]);
  }, []);

  const removeAuthorizedDevice = useCallback((serialNumber: string) => {
    setAuthorizedDevices(prev => prev.filter(sn => sn !== serialNumber));
  }, []);

  const clearData = useCallback(() => {
    setWaveData([]);
    setCurrentData([]);
    setLastWaveData(null);
    dataBufferRef.current = { waves: [], currents: [] };
  }, []);

  const exportData = useCallback(async (filters?: any) => {
    try {
      console.log('Starting data export...');
      // Implementação da exportação para Excel
      const XLSX = await import('xlsx');
      
      // Headers em português e espanhol
      const headers = {
        pt: {
          datetime: 'Data/Hora',
          hm0: 'Hm0 (m)',
          hmax: 'Hmax (m)',
          mdir: 'Mdir (°)',
          tm02: 'Tm02 (s)',
          tp: 'Tp (s)',
          pressure: 'Pressão (hPa)',
          temperature: 'Temperatura (°C)',
          pitch: 'Pitch (°)',
          roll: 'Roll (°)',
          cell: 'Célula',
          depth: 'Profundidade (m)',
          velocity: 'Velocidade (m/s)',
          direction: 'Direção (°)'
        },
        es: {
          datetime: 'Fecha/Hora',
          hm0: 'Hm0 (m)',
          hmax: 'Hmax (m)',
          mdir: 'Mdir (°)',
          tm02: 'Tm02 (s)',
          tp: 'Tp (s)',
          pressure: 'Presión (hPa)',
          temperature: 'Temperatura (°C)',
          pitch: 'Cabeceo (°)',
          roll: 'Balanceo (°)',
          cell: 'Celda',
          depth: 'Profundidad (m)',
          velocity: 'Velocidad (m/s)',
          direction: 'Dirección (°)'
        }
      };
      
      // Detectar idioma atual corretamente
      const currentLanguage = localStorage.getItem('i18nextLng') || document.documentElement.lang || 'pt';
      const lang = currentLanguage.startsWith('es') ? 'es' : 'pt';
      const h = headers[lang];
      
      console.log('Language detected:', lang, 'from:', currentLanguage);
      
      const waveWorksheet = XLSX.utils.json_to_sheet(
        dataBufferRef.current.waves.map(w => ({
          [h.datetime]: w.timestamp.toLocaleString(lang === 'es' ? 'es-ES' : 'pt-BR'),
          [h.hm0]: w.hm0,
          [h.hmax]: w.hmax,
          [h.mdir]: w.mdir,
          [h.tm02]: w.tm02,
          [h.tp]: w.tp,
          [h.pressure]: w.pressure,
          [h.temperature]: w.temperature,
          [h.pitch]: w.pitch,
          [h.roll]: w.roll
        }))
      );
      
      const currentWorksheet = XLSX.utils.json_to_sheet(
        dataBufferRef.current.currents.map(c => ({
          [h.datetime]: c.timestamp.toLocaleString(lang === 'es' ? 'es-ES' : 'pt-BR'),
          [h.cell]: c.cellNumber,
          [h.depth]: c.depth,
          [h.velocity]: c.velocity,
          [h.direction]: c.direction
        }))
      );
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, waveWorksheet, lang === 'es' ? 'Olas' : 'Ondas');
      XLSX.utils.book_append_sheet(workbook, currentWorksheet, lang === 'es' ? 'Corrientes' : 'Correntes');
      
      const fileName = `ADCP_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      console.log('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  }, []);

  // Serial Connection Functions
  const setSerialConfig = useCallback((config: Partial<SerialConfig>) => {
    setSerialConfigState(prev => ({ ...prev, ...config }));
  }, []);

  const listPorts = useCallback(async () => {
    try {
      console.log('Listing available ports...');
      const mockPorts = ['COM1', 'COM3', 'COM4', 'COM8'];
      setAvailablePorts(mockPorts);
      return mockPorts;
    } catch (error) {
      console.error('Error listing ports:', error);
      return [];
    }
  }, []);

  const connect = useCallback(async () => {
    if (!serialConfig.port) {
      setConnectionStatus(prev => ({ ...prev, error: 'Por favor, selecione uma porta' }));
      return false;
    }

    console.log('Attempting to connect to port:', serialConfig.port);
    setConnectionStatus({ isConnected: false, isConnecting: true, error: null });
    
    try {
      // Simulação da conexão serial
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Connection successful!');
      setConnectionStatus({ isConnected: true, isConnecting: false, error: null });
      return true;
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionStatus({ 
        isConnected: false, 
        isConnecting: false, 
        error: `Erro ao conectar: ${error}` 
      });
      return false;
    }
  }, [serialConfig]);

  const disconnect = useCallback(async () => {
    try {
      console.log('Disconnecting...');
      if (portRef.current) {
        portRef.current = null;
      }
      setConnectionStatus({ isConnected: false, isConnecting: false, error: null });
      
      // Stop measurement if running
      if (measurementState.isRunning) {
        updateMeasurementState({ isRunning: false, isInitializing: false });
        if (intervalsRef.current.wave) clearInterval(intervalsRef.current.wave);
        if (intervalsRef.current.current) clearInterval(intervalsRef.current.current);
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }, [measurementState.isRunning, updateMeasurementState]);

  const sendCommand = useCallback(async (command: string) => {
    if (!connectionStatus.isConnected) {
      throw new Error('Não conectado ao equipamento');
    }
    
    try {
      console.log(`Sending command: ${command}`);
      return true;
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }, [connectionStatus.isConnected]);

  // Start data simulation when measurement starts
  const startDataSimulation = useCallback(() => {
    console.log('Starting data simulation...');
    
    // Clear any existing intervals
    if (intervalsRef.current.wave) clearInterval(intervalsRef.current.wave);
    if (intervalsRef.current.current) clearInterval(intervalsRef.current.current);
    
    // Reset current data time reference
    currentDataTimeRef.current = Date.now();
    
    // Simulate wave data every 1 second
    intervalsRef.current.wave = setInterval(() => {
      if (!measurementState.isRunning) {
        if (intervalsRef.current.wave) clearInterval(intervalsRef.current.wave);
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

    // Simulate current data - create new profile every second (15 cells as per NMEA PNORI standard)
    intervalsRef.current.current = setInterval(() => {
      if (!measurementState.isRunning) {
        if (intervalsRef.current.current) clearInterval(intervalsRef.current.current);
        return;
      }

      // Create a new complete profile with the same timestamp for all cells (15 cells)
      const profileTimestamp = new Date();
      
      for (let cell = 1; cell <= 15; cell++) { // Padronizado para 15 células
        const currentData = {
          cellNumber: cell,
          depth: cell * 0.3, // 30cm cell size
          velocity: Math.random() * 0.5,
          direction: Math.random() * 360,
          timestamp: profileTimestamp // Same timestamp for all cells in this profile
        };

        addCurrentData(currentData);
      }
    }, 1000);
  }, [measurementState.isRunning, addWaveData, addCurrentData]);

  // Effect to start/stop simulation based on measurement state
  React.useEffect(() => {
    if (measurementState.isRunning) {
      startDataSimulation();
    } else {
      if (intervalsRef.current.wave) clearInterval(intervalsRef.current.wave);
      if (intervalsRef.current.current) clearInterval(intervalsRef.current.current);
    }
    
    return () => {
      if (intervalsRef.current.wave) clearInterval(intervalsRef.current.wave);
      if (intervalsRef.current.current) clearInterval(intervalsRef.current.current);
    };
  }, [measurementState.isRunning, startDataSimulation]);

  const contextValue: AppContextType = {
    waveData,
    currentData,
    lastWaveData,
    measurementState,
    alertConfig,
    authorizedDevices,
    currentDevice,
    serialConfig,
    connectionStatus,
    availablePorts,
    addWaveData,
    addCurrentData,
    updateMeasurementState,
    updateAlertConfig,
    addAuthorizedDevice,
    removeAuthorizedDevice,
    setCurrentDevice,
    clearData,
    exportData,
    setSerialConfig,
    listPorts,
    connect,
    disconnect,
    sendCommand
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
