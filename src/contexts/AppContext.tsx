import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { WaveData, CurrentData, AlertConfig, MeasurementState, ADCPConfig } from '@/types/adcp';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
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
  
  const dataBufferRef = useRef<{ waves: WaveData[], currents: CurrentData[] }>({
    waves: [],
    currents: []
  });

  const addWaveData = useCallback((data: WaveData) => {
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
        // Trigger alert notification
        console.warn('ALERTA:', alerts.join(', '));
        // Em ambiente real, aqui seria disparado um alerta visual/sonoro
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
      // Implementação da exportação para Excel
      const XLSX = await import('xlsx');
      
      const waveWorksheet = XLSX.utils.json_to_sheet(
        dataBufferRef.current.waves.map(w => ({
          'Data/Hora': w.timestamp.toISOString(),
          'Hm0 (m)': w.hm0,
          'Hmax (m)': w.hmax,
          'Mdir (°)': w.mdir,
          'Tm02 (s)': w.tm02,
          'Tp (s)': w.tp,
          'Pressão (hPa)': w.pressure,
          'Temperatura (°C)': w.temperature,
          'Pitch (°)': w.pitch,
          'Roll (°)': w.roll
        }))
      );
      
      const currentWorksheet = XLSX.utils.json_to_sheet(
        dataBufferRef.current.currents.map(c => ({
          'Data/Hora': c.timestamp.toISOString(),
          'Célula': c.cellNumber,
          'Profundidade (m)': c.depth,
          'Velocidade (m/s)': c.velocity,
          'Direção (°)': c.direction
        }))
      );
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, waveWorksheet, 'Ondas');
      XLSX.utils.book_append_sheet(workbook, currentWorksheet, 'Correntes');
      
      const fileName = `ADCP_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      console.log('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  }, []);

  const contextValue: AppContextType = {
    waveData,
    currentData,
    lastWaveData,
    measurementState,
    alertConfig,
    authorizedDevices,
    currentDevice,
    addWaveData,
    addCurrentData,
    updateMeasurementState,
    updateAlertConfig,
    addAuthorizedDevice,
    removeAuthorizedDevice,
    setCurrentDevice,
    clearData,
    exportData
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};