export interface WaveData {
  hm0: number;
  hmax: number;
  mdir: number;
  tm02: number;
  tp: number;
  pressure: number;
  temperature: number;
  pitch: number;
  roll: number;
  timestamp: Date;
}

export interface CurrentData {
  cellNumber: number;
  depth: number;
  velocity: number;
  direction: number;
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