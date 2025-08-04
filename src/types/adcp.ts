// Complete NMEA PNORW Wave Data (DF=501)
export interface WaveData {
  // Basic wave parameters
  hm0: number;              // Significant wave height (m)
  hmax: number;             // Maximum wave height (m) 
  mdir: number;             // Mean wave direction (°)
  tm02: number;             // Mean zero-crossing period (s)
  tp: number;               // Peak period (s)
  
  // Additional PNORW fields
  peakDirection: number;    // Peak wave direction (°)
  mainDirection: number;    // Principal wave direction (°)
  directionalityIndex: number; // Directional spreading index
  
  // Environmental data
  pressure: number;         // Pressure (dBar)
  temperature: number;      // Temperature (°C)
  pitch: number;           // Instrument pitch (°)
  roll: number;            // Instrument roll (°)
  
  // Metadata
  date: Date;              // Measurement date/time
  timestamp: Date;         // Processing timestamp
}

// NMEA PNORI Instrument Configuration
export interface InstrumentConfig {
  type: number;            // Instrument type
  serialNumber: string;    // Serial number
  beamCount: number;       // Number of acoustic beams
  cellCount: number;       // Number of measurement cells
  blankingDistance: number; // Blanking distance (m)
  cellSize: number;        // Cell size (m) 
  coordinates: number;     // Coordinate system (0=ENU, 1=BEAM)
}

// NMEA PNORS Environmental Conditions
export interface EnvironmentalData {
  date: Date;              // Measurement date/time
  battery: number;         // Battery voltage (V)
  soundSpeed: number;      // Speed of sound (m/s)
  heading: number;         // Compass heading (°)
  pressure: number;        // Pressure sensor (dBar)
  temperature: number;     // Temperature (°C)
  timestamp: Date;
}

// NMEA PNORC Current Data per Cell
export interface CurrentData {
  cellNumber: number;      // Cell number (1-based)
  depth: number;           // Depth from transducer (m)
  eastComponent: number;   // East velocity component (m/s)
  northComponent: number;  // North velocity component (m/s)
  velocity: number;        // Resultant velocity magnitude (m/s)
  direction: number;       // Current direction (° True)
  
  // Quality indicators
  echoIntensity: number[];  // Echo intensity per beam
  correlation: number[];    // Correlation values per beam
  
  timestamp: Date;
}

export interface ADCPConfig {
  serialNumber: string;
  isAuthorized: boolean;
}

export interface ADCPStatus {
  serialNumber: string;
  status: string;
  temperature: number;
  pressure: number;
  battery: number;
  timestamp: Date;
}

export interface AlertConfig {
  hm0Limit: number;
  hmaxLimit: number;
  tm02Limit: number;
  enableAlerts: boolean;
  enableAlertSound: boolean;
}

export interface MeasurementState {
  isRunning: boolean;
  isInitializing: boolean;
  startTime: Date | null;
  error: string | null;
}

export const INITIALIZATION_COMMANDS = [
  "@@@@@@",
  "K1W%!Q\r\n",
  "K1W%!Q\r\n",
  "SETDEFAULT,CONFIG",
  "SETPLAN,MIAVG=1,AVG=1,SA=35,BURST=1,MIBURST=1024,SV=0,FN=\"RealTime\",SO=0",
  "SETAVG,NC=30,CS=2,BD=0.3,DF=7,CY=\"ENU\",PL=0,AI=1,VR=2.5,NPING=1,NB=3",
  "SETTMAVG,EN=1,AVG=1,CY=\"ENU\",FO=1,SO=1,DF=100,CD=1,PD=1,TV=1,TA=1,TC=1,DISTILT=0,TPG=0,MAPBINS=0",
  "SETBURST,NC=20,CS=2,BD=24.5,DF=3,CY=\"BEAM\",PL=0,NS=2048,SR=2,VR=5,NPING=1,NB=3,ALTI=1,ALTISTART=33.4,ALTIEND=66.6,RAWALTI=1",
  "SETTMBURST,EN=0,CY=\"BEAM\",FO=1,SO=0,DF=3",
  "SETWAVEPROC,EN=1,MOUNTHEIGHT=0.5,MODE=\"MLMST\",BANDSEPFREQ=0.2,FREQSTART=0.02,FREQSTEP=0.01,FREQEND=0.49",
  "SETTMWAVE,EN=1,DF=501,TFS=0,TWAP=1,TWDR=0,TWBS=0,TEDS=0,SO=1,FO=1",
  "SAVE,CONFIG",
  "START"
];