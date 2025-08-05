import { 
  WaveData, 
  InstrumentConfig, 
  EnvironmentalData, 
  CurrentCellData, 
  CurrentProfile,
  OrientationCode,
  SpectrumBasisType,
  ProcessingMethod,
  CoordinateSystem
} from '../types/NMEATypes';

export class NMEAParser {
  private instrumentConfig?: InstrumentConfig;
  private currentProfileBuffer: Map<string, CurrentCellData[]> = new Map();

  /**
   * Parse NMEA string and return appropriate data structure
   */
  parseNMEAString(nmeaString: string): { type: string; data: any } | null {
    try {
      // Validate checksum
      if (!this.validateChecksum(nmeaString)) {
        console.warn('Invalid NMEA checksum:', nmeaString);
        return null;
      }

      // Remove checksum and split
      const cleanString = nmeaString.split('*')[0];
      const fields = cleanString.split(',');
      const messageType = fields[0];

      switch (messageType) {
        case '$PNORW':
          return { type: 'wave', data: this.parsePNORW(fields) };
        case '$PNORI':
          return { type: 'config', data: this.parsePNORI(fields) };
        case '$PNORS':
          return { type: 'environmental', data: this.parsePNORS(fields) };
        case '$PNORC':
          return { type: 'current', data: this.parsePNORC(fields) };
        default:
          console.warn('Unknown NMEA message type:', messageType);
          return null;
      }
    } catch (error) {
      console.error('Error parsing NMEA string:', error, nmeaString);
      return null;
    }
  }

  /**
   * Parse $PNORW - Wave Data (DF=501)
   */
  private parsePNORW(fields: string[]): WaveData {
    const parseDate = (dateStr: string, timeStr: string): Date => {
      // MMDDYY format
      const month = parseInt(dateStr.substring(0, 2)) - 1; // 0-based month
      const day = parseInt(dateStr.substring(2, 4));
      const year = 2000 + parseInt(dateStr.substring(4, 6));
      
      // HHMMSS format
      const hours = parseInt(timeStr.substring(0, 2));
      const minutes = parseInt(timeStr.substring(2, 4));
      const seconds = parseInt(timeStr.substring(4, 6));
      
      return new Date(year, month, day, hours, minutes, seconds);
    };

    const date = parseDate(fields[1], fields[2]);
    
    return {
      date,
      timestamp: new Date(),
      spectrumBasis: parseInt(fields[3]) as SpectrumBasisType,
      processingMethod: parseInt(fields[4]) as ProcessingMethod,
      hm0: parseFloat(fields[5]),
      h3: parseFloat(fields[6]),
      h10: parseFloat(fields[7]),
      hmax: parseFloat(fields[8]),
      tm02: parseFloat(fields[9]),
      tp: parseFloat(fields[10]),
      tz: parseFloat(fields[11]),
      dirTp: parseFloat(fields[12]),
      sprTp: parseFloat(fields[13]),
      mainDirection: parseFloat(fields[14]),
      unidirectivityIndex: parseFloat(fields[15]),
      meanPressure: parseFloat(fields[16]),
      noDetects: parseInt(fields[17]),
      badDetects: parseInt(fields[18]),
      nearSurfaceCurrentSpeed: parseFloat(fields[19]),
      nearSurfaceCurrentDirection: parseFloat(fields[20]),
      errorCode: fields[21] || ''
    };
  }

  /**
   * Parse $PNORI - Instrument Configuration
   */
  private parsePNORI(fields: string[]): InstrumentConfig {
    const config: InstrumentConfig = {
      instrumentType: parseInt(fields[1]),
      headId: fields[2],
      beamCount: parseInt(fields[3]),
      cellCount: parseInt(fields[4]),
      blankingDistance: parseFloat(fields[5]),
      cellSize: parseFloat(fields[6]),
      coordinateSystem: parseInt(fields[7]) as CoordinateSystem,
      timestamp: new Date()
    };

    // Store for later use in current data calculations
    this.instrumentConfig = config;
    return config;
  }

  /**
   * Parse $PNORS - Environmental/Sensor Data
   */
  private parsePNORS(fields: string[]): EnvironmentalData {
    const parseDate = (dateStr: string, timeStr: string): Date => {
      const month = parseInt(dateStr.substring(0, 2)) - 1;
      const day = parseInt(dateStr.substring(2, 4));
      const year = 2000 + parseInt(dateStr.substring(4, 6));
      
      const hours = parseInt(timeStr.substring(0, 2));
      const minutes = parseInt(timeStr.substring(2, 4));
      const seconds = parseInt(timeStr.substring(4, 6));
      
      return new Date(year, month, day, hours, minutes, seconds);
    };

    const date = parseDate(fields[1], fields[2]);
    const pitch = parseFloat(fields[8]);
    const roll = parseFloat(fields[9]);
    const statusCode = fields[4];
    
    // Extract orientation from status code bits 27-25
    const statusInt = parseInt(statusCode, 16);
    const orientationBits = (statusInt >> 25) & 0x7; // Extract bits 27-25
    const orientation = orientationBits as OrientationCode;

    return {
      date,
      timestamp: new Date(),
      errorStatus: fields[3],
      statusCode,
      batteryVoltage: parseFloat(fields[5]),
      soundSpeed: parseFloat(fields[6]),
      heading: parseFloat(fields[7]),
      pitch,
      roll,
      pressure: parseFloat(fields[10]),
      temperature: parseFloat(fields[11]),
      tilt: Math.sqrt(pitch * pitch + roll * roll),
      orientation,
      analogInput1: fields[12] ? parseFloat(fields[12]) : undefined,
      analogInput2: fields[13] ? parseFloat(fields[13]) : undefined
    };
  }

  /**
   * Parse $PNORC - Current Data per Cell
   */
  private parsePNORC(fields: string[]): CurrentCellData {
    const parseDate = (dateStr: string, timeStr: string): Date => {
      const month = parseInt(dateStr.substring(0, 2)) - 1;
      const day = parseInt(dateStr.substring(2, 4));
      const year = 2000 + parseInt(dateStr.substring(4, 6));
      
      const hours = parseInt(timeStr.substring(0, 2));
      const minutes = parseInt(timeStr.substring(2, 4));
      const seconds = parseInt(timeStr.substring(4, 6));
      
      return new Date(year, month, day, hours, minutes, seconds);
    };

    const date = parseDate(fields[1], fields[2]);
    const cellNumber = parseInt(fields[3]);
    
    // Calculate depth based on instrument configuration and orientation
    const depth = this.calculateCellDepth(cellNumber);
    
    const eastVelocity = parseFloat(fields[4]);
    const northVelocity = parseFloat(fields[5]);
    const upVelocity1 = parseFloat(fields[6]);
    const upVelocity2 = fields[7] ? parseFloat(fields[7]) : undefined;
    
    const speed = parseFloat(fields[8]);
    const direction = parseFloat(fields[9]);
    
    // Parse amplitude and correlation values for each beam
    const amplitude: number[] = [];
    const correlation: number[] = [];
    
    // Determine beam count from instrument config
    const beamCount = this.instrumentConfig?.beamCount || 4;
    
    // Amplitude values start at field 11
    for (let i = 0; i < beamCount; i++) {
      amplitude.push(parseInt(fields[11 + i]));
    }
    
    // Correlation values start after amplitude values
    for (let i = 0; i < beamCount; i++) {
      correlation.push(parseInt(fields[11 + beamCount + i]));
    }
    
    // Assess data quality
    const meanCorrelation = correlation.reduce((a, b) => a + b) / correlation.length;
    const qualityGrade = this.assessDataQuality(meanCorrelation, amplitude);
    
    return {
      date,
      timestamp: new Date(),
      cellNumber,
      depth,
      eastVelocity,
      northVelocity,
      upVelocity1,
      upVelocity2,
      speed,
      direction,
      amplitude,
      correlation,
      isValid: meanCorrelation > 50 && !isNaN(speed), // Basic validity check
      qualityGrade
    };
  }

  /**
   * Calculate cell depth based on instrument configuration and orientation
   */
  private calculateCellDepth(cellNumber: number, instrumentDepth: number = 0): number {
    if (!this.instrumentConfig) {
      // Fallback calculation
      return cellNumber * 1.0; // Assume 1m cell size
    }

    const { blankingDistance, cellSize } = this.instrumentConfig;
    const cellDistance = blankingDistance + (cellNumber - 1) * cellSize;
    
    // For now, return relative depth (distance from instrument)
    // In real implementation, would use orientation and instrument depth
    return cellDistance;
  }

  /**
   * Assess data quality based on correlation and amplitude
   */
  private assessDataQuality(meanCorrelation: number, amplitude: number[]): 'excellent' | 'good' | 'fair' | 'poor' {
    const meanAmplitude = amplitude.reduce((a, b) => a + b) / amplitude.length;
    
    if (meanCorrelation > 80 && meanAmplitude > 100) return 'excellent';
    if (meanCorrelation > 70 && meanAmplitude > 80) return 'good';
    if (meanCorrelation > 50 && meanAmplitude > 50) return 'fair';
    return 'poor';
  }

  /**
   * Validate NMEA checksum
   */
  private validateChecksum(nmeaString: string): boolean {
    const parts = nmeaString.split('*');
    if (parts.length !== 2) return false;
    
    const sentence = parts[0].substring(1); // Remove leading $
    const providedChecksum = parts[1].substring(0, 2); // Take first 2 chars (ignore CR/LF)
    
    let calculatedChecksum = 0;
    for (let i = 0; i < sentence.length; i++) {
      calculatedChecksum ^= sentence.charCodeAt(i);
    }
    
    const checksumHex = calculatedChecksum.toString(16).toUpperCase().padStart(2, '0');
    return checksumHex === providedChecksum.toUpperCase();
  }

  /**
   * Build complete current profile from buffered cell data
   */
  buildCurrentProfile(timestamp: string, environmentalData: EnvironmentalData): CurrentProfile | null {
    const cells = this.currentProfileBuffer.get(timestamp);
    if (!cells || !this.instrumentConfig) return null;

    // Sort cells by cell number
    cells.sort((a, b) => a.cellNumber - b.cellNumber);

    // Calculate profile statistics
    const validCells = cells.filter(cell => cell.isValid);
    
    let profileMeanSpeed = 0;
    let totalEast = 0;
    let totalNorth = 0;
    
    validCells.forEach(cell => {
      profileMeanSpeed += cell.speed;
      totalEast += cell.eastVelocity;
      totalNorth += cell.northVelocity;
    });
    
    profileMeanSpeed /= validCells.length;
    
    // Calculate mean direction from vector components
    const meanEast = totalEast / validCells.length;
    const meanNorth = totalNorth / validCells.length;
    let profileMeanDirection = Math.atan2(meanEast, meanNorth) * 180 / Math.PI;
    if (profileMeanDirection < 0) profileMeanDirection += 360;

    const profile: CurrentProfile = {
      timestamp: new Date(timestamp),
      instrumentConfig: this.instrumentConfig,
      environmentalData,
      cells,
      profileMeanSpeed: isNaN(profileMeanSpeed) ? 0 : profileMeanSpeed,
      profileMeanDirection: isNaN(profileMeanDirection) ? 0 : profileMeanDirection,
      validCellCount: validCells.length
    };

    // Clear buffer for this timestamp
    this.currentProfileBuffer.delete(timestamp);
    
    return profile;
  }

  /**
   * Add current cell data to buffer for profile building
   */
  bufferCurrentCellData(cellData: CurrentCellData): void {
    const timestampKey = cellData.date.toISOString();
    
    if (!this.currentProfileBuffer.has(timestampKey)) {
      this.currentProfileBuffer.set(timestampKey, []);
    }
    
    this.currentProfileBuffer.get(timestampKey)!.push(cellData);
  }
}