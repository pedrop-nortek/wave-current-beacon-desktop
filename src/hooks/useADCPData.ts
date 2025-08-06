import { useState, useEffect, useCallback } from 'react';
import { 
  ADCPDataset, 
  WaveData, 
  EnvironmentalData, 
  CurrentProfile,
  CurrentParameter,
  WaveParameter 
} from '@/types/NMEATypes';
import { NMEAParser } from '@/parsers/NMEAParser';

interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

interface HovmollerPoint {
  timestamp: string;
  depth: number;
  value: number;
}

export function useADCPData() {
  const [dataset, setDataset] = useState<ADCPDataset>({
    waveHistory: [],
    environmentalHistory: [],
    profileHistory: [],
    isConnected: false
  });

  const [parser] = useState(() => new NMEAParser());

  // Simulate data generation for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      generateSimulatedData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const generateSimulatedData = useCallback(() => {
    const now = new Date();
    
    // Generate simulated environmental data
    const envData: EnvironmentalData = {
      date: now,
      timestamp: now,
      errorStatus: "00000000",
      statusCode: "2A480000",
      batteryVoltage: 14.2 + Math.random() * 0.4,
      soundSpeed: 1520 + Math.random() * 10,
      heading: Math.random() * 360,
      pitch: (Math.random() - 0.5) * 10,
      roll: (Math.random() - 0.5) * 10,
      pressure: 15 + Math.random() * 5,
      temperature: 20 + Math.random() * 5,
      tilt: 0,
      orientation: 5 // ZDOWN
    };
    envData.tilt = Math.sqrt(envData.pitch * envData.pitch + envData.roll * envData.roll);

    // Generate simulated current profile
    const cells = Array.from({ length: 20 }, (_, i) => ({
      date: now,
      timestamp: now,
      cellNumber: i + 1,
      depth: 0.5 + i * 1.0, // 0.5m blanking + 1m cells
      eastVelocity: (Math.random() - 0.5) * 1.0,
      northVelocity: (Math.random() - 0.5) * 1.0,
      upVelocity1: (Math.random() - 0.5) * 0.2,
      upVelocity2: (Math.random() - 0.5) * 0.2,
      speed: Math.random() * 0.8,
      direction: Math.random() * 360,
      amplitude: Array.from({ length: 4 }, () => 80 + Math.random() * 40),
      correlation: Array.from({ length: 4 }, () => 70 + Math.random() * 25),
      isValid: Math.random() > 0.1,
      qualityGrade: (['excellent', 'good', 'fair', 'poor'] as const)[Math.floor(Math.random() * 4)]
    }));

    const profile: CurrentProfile = {
      timestamp: now,
      instrumentConfig: {
        instrumentType: 2,
        headId: "Signature1000_12345",
        beamCount: 4,
        cellCount: 20,
        blankingDistance: 0.5,
        cellSize: 1.0,
        coordinateSystem: 0,
        timestamp: now
      },
      environmentalData: envData,
      cells,
      profileMeanSpeed: cells.reduce((sum, cell) => sum + cell.speed, 0) / cells.length,
      profileMeanDirection: Math.random() * 360,
      validCellCount: cells.filter(cell => cell.isValid).length
    };

    // Generate simulated wave data (less frequently)
    const waveData: WaveData = {
      date: now,
      timestamp: now,
      spectrumBasis: 0,
      processingMethod: 4,
      hm0: 0.5 + Math.random() * 2.0,
      h3: 0.7 + Math.random() * 2.5,
      h10: 0.9 + Math.random() * 3.0,
      hmax: 1.2 + Math.random() * 4.0,
      tm02: 4 + Math.random() * 6,
      tp: 5 + Math.random() * 8,
      tz: 3 + Math.random() * 5,
      dirTp: Math.random() * 360,
      sprTp: 20 + Math.random() * 40,
      mainDirection: Math.random() * 360,
      unidirectivityIndex: Math.random(),
      meanPressure: 15 + Math.random() * 5,
      noDetects: Math.floor(Math.random() * 5),
      badDetects: Math.floor(Math.random() * 3),
      nearSurfaceCurrentSpeed: Math.random() * 0.5,
      nearSurfaceCurrentDirection: Math.random() * 360,
      errorCode: "0000"
    };

    setDataset(prev => ({
      ...prev,
      latestWave: waveData,
      latestEnvironmental: envData,
      latestProfile: profile,
      waveHistory: [...prev.waveHistory.slice(-100), waveData], // Keep last 100
      environmentalHistory: [...prev.environmentalHistory.slice(-500), envData], // Keep last 500
      profileHistory: [...prev.profileHistory.slice(-100), profile], // Keep last 100
      isConnected: true,
      lastUpdateTime: now
    }));
  }, []);

  const getTimeSeriesData = useCallback((
    dataType: 'current' | 'wave',
    parameter: CurrentParameter | WaveParameter,
    timeRange: string
  ): TimeSeriesPoint[] => {
    const now = new Date();
    const rangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }[timeRange] || 60 * 60 * 1000;

    const cutoffTime = new Date(now.getTime() - rangeMs);

    if (dataType === 'current') {
      // Extract from environmental or profile data
      if (['batteryVoltage', 'soundSpeed', 'heading', 'pitch', 'roll', 'tilt', 'pressure', 'temperature'].includes(parameter)) {
        return dataset.environmentalHistory
          .filter(env => env.timestamp >= cutoffTime)
          .map(env => ({
            timestamp: env.timestamp.toISOString(),
            value: env[parameter as keyof EnvironmentalData] as number
          }));
      } else {
        // Profile-level parameters
        return dataset.profileHistory
          .filter(profile => profile.timestamp >= cutoffTime)
          .map(profile => ({
            timestamp: profile.timestamp.toISOString(),
            value: parameter === 'speed' ? profile.profileMeanSpeed : 
                   parameter === 'direction' ? profile.profileMeanDirection : 0
          }));
      }
    } else {
      // Wave data
      return dataset.waveHistory
        .filter(wave => wave.timestamp >= cutoffTime)
        .map(wave => ({
          timestamp: wave.timestamp.toISOString(),
          value: wave[parameter as keyof WaveData] as number
        }));
    }
  }, [dataset]);

  const getHovmollerData = useCallback((
    parameter: CurrentParameter,
    timeRange: string
  ): HovmollerPoint[] => {
    const now = new Date();
    const rangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000
    }[timeRange] || 60 * 60 * 1000;

    const cutoffTime = new Date(now.getTime() - rangeMs);

    const points: HovmollerPoint[] = [];

    dataset.profileHistory
      .filter(profile => profile.timestamp >= cutoffTime)
      .forEach(profile => {
        profile.cells.forEach(cell => {
          if (cell.isValid) {
            points.push({
              timestamp: profile.timestamp.toISOString(),
              depth: cell.depth,
              value: cell[parameter as keyof typeof cell] as number || 0
            });
          }
        });
      });

    return points;
  }, [dataset]);

  const getCurrentWaveData = useCallback((): WaveData | null => {
    return dataset.latestWave || null;
  }, [dataset]);

  const getCurrentCurrentData = useCallback((): EnvironmentalData | null => {
    return dataset.latestEnvironmental || null;
  }, [dataset]);

  const processNMEAString = useCallback((nmeaString: string) => {
    const result = parser.parseNMEAString(nmeaString);
    if (!result) return;

    const now = new Date();

    switch (result.type) {
      case 'wave':
        setDataset(prev => ({
          ...prev,
          latestWave: result.data,
          waveHistory: [...prev.waveHistory.slice(-100), result.data],
          lastUpdateTime: now
        }));
        break;

      case 'environmental':
        setDataset(prev => ({
          ...prev,
          latestEnvironmental: result.data,
          environmentalHistory: [...prev.environmentalHistory.slice(-500), result.data],
          lastUpdateTime: now
        }));
        break;

      case 'current':
        parser.bufferCurrentCellData(result.data);
        // Note: Profile building would happen when we have all cells for a timestamp
        break;

      case 'config':
        setDataset(prev => ({
          ...prev,
          instrumentConfig: result.data,
          lastUpdateTime: now
        }));
        break;
    }
  }, [parser]);

  return {
    dataset,
    getTimeSeriesData,
    getHovmollerData,
    getCurrentWaveData,
    getCurrentCurrentData,
    processNMEAString,
    isConnected: dataset.isConnected
  };
}