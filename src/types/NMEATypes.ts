// Complete NMEA ADCP Data Types

export enum OrientationCode {
  XUP = 0,    // X axis pointing up
  XDOWN = 1,  // X axis pointing down
  YUP = 2,    // Y axis pointing up
  YDOWN = 3,  // Y axis pointing down
  ZUP = 4,    // Z axis pointing up (typical for bottom-mounted, pointing to surface)
  ZDOWN = 5,  // Z axis pointing down (typical for surface-mounted, pointing down)
  AHRS = 7    // Arbitrary orientation reported by AHRS unit
}

export enum SpectrumBasisType {
  PRESSURE = 0,
  VELOCITY = 1,
  AST = 3  // Acoustic Surface Tracking
}

export enum ProcessingMethod {
  PUV = 1,
  SUV = 2,
  MLM = 3,
  MLMST = 4
}

export enum CoordinateSystem {
  ENU = 0,  // East/North/Up
  XYZ = 1,
  BEAM = 2
}

// $PNORW - Wave Data (DF=501)
export interface WaveData {
  // Timestamp
  date: Date;
  timestamp: Date;
  
  // Processing info
  spectrumBasis: SpectrumBasisType;
  processingMethod: ProcessingMethod;
  
  // Wave height parameters
  hm0: number;              // Significant wave height (m)
  h3: number;               // Mean height of highest 1/3 waves (m)
  h10: number;              // Mean height of highest 1/10 waves (m)
  hmax: number;             // Maximum wave height (m)
  
  // Wave period parameters
  tm02: number;             // Mean energy period (s)
  tp: number;               // Peak period (s)
  tz: number;               // Mean zero-crossing period (s)
  
  // Wave direction parameters
  dirTp: number;            // Peak direction (deg)
  sprTp: number;            // Directional spreading at peak (deg)
  mainDirection: number;    // Mean principal direction (deg)
  unidirectivityIndex: number; // Unidirectionality index
  
  // Environmental during wave measurement
  meanPressure: number;     // Mean pressure (dBar)
  noDetects: number;        // Number of no detects
  badDetects: number;       // Number of bad detects
  
  // Near-surface current during wave measurement
  nearSurfaceCurrentSpeed: number;    // (m/s)
  nearSurfaceCurrentDirection: number; // (deg)
  
  // Quality and status
  errorCode: string;        // Hex error code
}

// $PNORI - Instrument Configuration
export interface InstrumentConfig {
  instrumentType: number;     // Instrument type (e.g., 2 = Aquadopp Profiler)
  headId: string;            // Head ID/Serial number
  beamCount: number;         // Number of acoustic beams (3 or 4)
  cellCount: number;         // Number of measurement cells
  blankingDistance: number;  // Blanking distance (m)
  cellSize: number;          // Cell size (m)
  coordinateSystem: CoordinateSystem; // Coordinate system
  timestamp: Date;
}

// $PNORS - Environmental/Sensor Data
export interface EnvironmentalData {
  date: Date;
  timestamp: Date;
  
  // Status codes
  errorStatus: string;       // Error status (hex)
  statusCode: string;        // 32-bit status code (hex)
  
  // Sensor readings
  batteryVoltage: number;    // Battery voltage (V)
  soundSpeed: number;        // Speed of sound (m/s)
  heading: number;           // Compass heading (deg)
  pitch: number;             // Pitch angle (deg)
  roll: number;              // Roll angle (deg)
  pressure: number;          // Pressure (dBar)
  temperature: number;       // Temperature (°C)
  
  // Calculated values
  tilt: number;              // Calculated tilt = √(pitch² + roll²)
  orientation: OrientationCode; // Extracted from status code bits 27-25
  
  // Analog inputs (if available)
  analogInput1?: number;
  analogInput2?: number;
}

// $PNORC - Current Data per Cell
export interface CurrentCellData {
  date: Date;
  timestamp: Date;
  
  // Cell identification
  cellNumber: number;        // Cell number (1-based)
  depth: number;             // Calculated depth from transducer (m)
  
  // Velocity components
  eastVelocity: number;      // East component (m/s) - Velocity 1
  northVelocity: number;     // North component (m/s) - Velocity 2
  upVelocity1: number;       // Up component 1 (m/s) - Velocity 3
  upVelocity2?: number;      // Up component 2 (m/s) - Velocity 4 (4-beam only)
  
  // Derived velocity
  speed: number;             // Resultant velocity magnitude (m/s)
  direction: number;         // Current direction (deg True)
  
  // Quality indicators per beam
  amplitude: number[];       // Echo intensity per beam [Beam1, Beam2, Beam3, Beam4?]
  correlation: number[];     // Correlation values per beam [Beam1, Beam2, Beam3, Beam4?]
  
  // Quality flags
  isValid: boolean;          // Overall validity of measurement
  qualityGrade: 'excellent' | 'good' | 'fair' | 'poor'; // Derived quality assessment
}

// Profile data container
export interface CurrentProfile {
  timestamp: Date;
  instrumentConfig: InstrumentConfig;
  environmentalData: EnvironmentalData;
  cells: CurrentCellData[];
  
  // Derived profile statistics
  profileMeanSpeed: number;      // Mean speed across all valid cells
  profileMeanDirection: number;  // Mean direction (vector average)
  validCellCount: number;        // Number of cells with valid data
}

// Complete ADCP dataset
export interface ADCPDataset {
  // Latest measurements
  latestWave?: WaveData;
  latestEnvironmental?: EnvironmentalData;
  latestProfile?: CurrentProfile;
  
  // Historical data
  waveHistory: WaveData[];
  environmentalHistory: EnvironmentalData[];
  profileHistory: CurrentProfile[];
  
  // Instrument state
  instrumentConfig?: InstrumentConfig;
  isConnected: boolean;
  lastUpdateTime?: Date;
}

// Widget parameter types
export type CurrentParameter = 
  | 'batteryVoltage'
  | 'soundSpeed'
  | 'heading'
  | 'pitch'
  | 'roll'
  | 'tilt'
  | 'pressure'
  | 'temperature'
  | 'eastVelocity'
  | 'northVelocity'
  | 'upVelocity1'
  | 'upVelocity2'
  | 'speed'
  | 'direction'
  | 'amplitude'
  | 'correlation';

export type WaveParameter = 
  | 'hm0'
  | 'h3'
  | 'h10'
  | 'hmax'
  | 'tm02'
  | 'tp'
  | 'tz'
  | 'dirTp'
  | 'sprTp'
  | 'mainDirection'
  | 'unidirectivityIndex'
  | 'meanPressure'
  | 'noDetects'
  | 'badDetects'
  | 'nearSurfaceCurrentSpeed'
  | 'nearSurfaceCurrentDirection';

// Parameter metadata
export interface ParameterMetadata {
  label: string;
  unit: string;
  description: string;
  range: [number, number];
  colorScheme: 'sequential' | 'divergent' | 'categorical';
  decimalPlaces: number;
}

export const CURRENT_PARAMETER_META: Record<CurrentParameter, ParameterMetadata> = {
  batteryVoltage: { label: 'Battery Voltage', unit: 'V', description: 'Instrument battery voltage', range: [0, 20], colorScheme: 'sequential', decimalPlaces: 1 },
  soundSpeed: { label: 'Sound Speed', unit: 'm/s', description: 'Speed of sound in water', range: [1400, 1600], colorScheme: 'sequential', decimalPlaces: 1 },
  heading: { label: 'Heading', unit: '°', description: 'Compass heading', range: [0, 360], colorScheme: 'categorical', decimalPlaces: 1 },
  pitch: { label: 'Pitch', unit: '°', description: 'Instrument pitch angle', range: [-30, 30], colorScheme: 'divergent', decimalPlaces: 1 },
  roll: { label: 'Roll', unit: '°', description: 'Instrument roll angle', range: [-30, 30], colorScheme: 'divergent', decimalPlaces: 1 },
  tilt: { label: 'Tilt', unit: '°', description: 'Total instrument tilt', range: [0, 45], colorScheme: 'sequential', decimalPlaces: 1 },
  pressure: { label: 'Pressure', unit: 'dBar', description: 'Hydrostatic pressure', range: [0, 1000], colorScheme: 'sequential', decimalPlaces: 1 },
  temperature: { label: 'Temperature', unit: '°C', description: 'Water temperature', range: [0, 35], colorScheme: 'sequential', decimalPlaces: 1 },
  eastVelocity: { label: 'East Velocity', unit: 'm/s', description: 'Eastward velocity component', range: [-2, 2], colorScheme: 'divergent', decimalPlaces: 3 },
  northVelocity: { label: 'North Velocity', unit: 'm/s', description: 'Northward velocity component', range: [-2, 2], colorScheme: 'divergent', decimalPlaces: 3 },
  upVelocity1: { label: 'Up Velocity 1', unit: 'm/s', description: 'Upward velocity component 1', range: [-1, 1], colorScheme: 'divergent', decimalPlaces: 3 },
  upVelocity2: { label: 'Up Velocity 2', unit: 'm/s', description: 'Upward velocity component 2', range: [-1, 1], colorScheme: 'divergent', decimalPlaces: 3 },
  speed: { label: 'Speed', unit: 'm/s', description: 'Current speed magnitude', range: [0, 3], colorScheme: 'sequential', decimalPlaces: 3 },
  direction: { label: 'Direction', unit: '°', description: 'Current direction', range: [0, 360], colorScheme: 'categorical', decimalPlaces: 1 },
  amplitude: { label: 'Amplitude', unit: 'counts', description: 'Echo intensity', range: [0, 255], colorScheme: 'sequential', decimalPlaces: 0 },
  correlation: { label: 'Correlation', unit: '%', description: 'Signal correlation', range: [0, 100], colorScheme: 'sequential', decimalPlaces: 0 }
};

export const WAVE_PARAMETER_META: Record<WaveParameter, ParameterMetadata> = {
  hm0: { label: 'Significant Wave Height', unit: 'm', description: 'Hm0 - Significant wave height', range: [0, 10], colorScheme: 'sequential', decimalPlaces: 2 },
  h3: { label: 'H1/3', unit: 'm', description: 'Mean height of highest 1/3 waves', range: [0, 15], colorScheme: 'sequential', decimalPlaces: 2 },
  h10: { label: 'H1/10', unit: 'm', description: 'Mean height of highest 1/10 waves', range: [0, 20], colorScheme: 'sequential', decimalPlaces: 2 },
  hmax: { label: 'Maximum Wave Height', unit: 'm', description: 'Maximum wave height', range: [0, 25], colorScheme: 'sequential', decimalPlaces: 2 },
  tm02: { label: 'Mean Energy Period', unit: 's', description: 'Tm02 - Mean energy period', range: [0, 25], colorScheme: 'sequential', decimalPlaces: 1 },
  tp: { label: 'Peak Period', unit: 's', description: 'Tp - Peak period', range: [0, 30], colorScheme: 'sequential', decimalPlaces: 1 },
  tz: { label: 'Zero-Crossing Period', unit: 's', description: 'Tz - Mean zero-crossing period', range: [0, 20], colorScheme: 'sequential', decimalPlaces: 1 },
  dirTp: { label: 'Peak Direction', unit: '°', description: 'Direction at spectral peak', range: [0, 360], colorScheme: 'categorical', decimalPlaces: 1 },
  sprTp: { label: 'Directional Spreading', unit: '°', description: 'Directional spreading at peak', range: [0, 180], colorScheme: 'sequential', decimalPlaces: 1 },
  mainDirection: { label: 'Mean Direction', unit: '°', description: 'Principal wave direction', range: [0, 360], colorScheme: 'categorical', decimalPlaces: 1 },
  unidirectivityIndex: { label: 'Unidirectionality', unit: '', description: 'Unidirectionality index', range: [0, 1], colorScheme: 'sequential', decimalPlaces: 3 },
  meanPressure: { label: 'Mean Pressure', unit: 'dBar', description: 'Mean pressure during wave measurement', range: [0, 1000], colorScheme: 'sequential', decimalPlaces: 1 },
  noDetects: { label: 'No Detects', unit: 'count', description: 'Number of no detections', range: [0, 100], colorScheme: 'sequential', decimalPlaces: 0 },
  badDetects: { label: 'Bad Detects', unit: 'count', description: 'Number of bad detections', range: [0, 100], colorScheme: 'sequential', decimalPlaces: 0 },
  nearSurfaceCurrentSpeed: { label: 'Surface Current Speed', unit: 'm/s', description: 'Near-surface current speed', range: [0, 3], colorScheme: 'sequential', decimalPlaces: 3 },
  nearSurfaceCurrentDirection: { label: 'Surface Current Direction', unit: '°', description: 'Near-surface current direction', range: [0, 360], colorScheme: 'categorical', decimalPlaces: 1 }
};