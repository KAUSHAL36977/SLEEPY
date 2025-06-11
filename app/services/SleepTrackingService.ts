import { accelerometer, gyroscope } from 'react-native-sensors';
import { setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import Voice from '@react-native-community/voice';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set sensor update interval (in milliseconds)
setUpdateIntervalForType(SensorTypes.accelerometer, 1000);
setUpdateIntervalForType(SensorTypes.gyroscope, 1000);

export interface SleepData {
  startTime: Date;
  endTime: Date;
  sleepPhases: SleepPhase[];
  snoreEvents: SnoreEvent[];
  heartRateData: HeartRateData[];
  qualityScore: number;
}

export interface SleepPhase {
  type: 'light' | 'deep' | 'rem' | 'awake';
  startTime: Date;
  endTime: Date;
  confidence: number;
}

export interface SnoreEvent {
  timestamp: Date;
  intensity: number;
  duration: number;
}

export interface HeartRateData {
  timestamp: Date;
  rate: number;
}

export class SleepTrackingService {
  private isTracking: boolean = false;
  private accelerometerSubscription: any = null;
  private gyroscopeSubscription: any = null;
  private voiceSubscription: any = null;
  private currentSleepData: SleepData | null = null;

  async startTracking(): Promise<void> {
    if (this.isTracking) return;

    try {
      // Initialize sleep session
      this.currentSleepData = {
        startTime: new Date(),
        endTime: new Date(),
        sleepPhases: [],
        snoreEvents: [],
        heartRateData: [],
        qualityScore: 0,
      };

      // Start motion tracking
      this.accelerometerSubscription = accelerometer.subscribe(({ x, y, z }) => {
        this.processMotionData(x, y, z);
      });

      this.gyroscopeSubscription = gyroscope.subscribe(({ x, y, z }) => {
        this.processGyroscopeData(x, y, z);
      });

      // Start snore detection if permission granted
      if (Platform.OS === 'android') {
        await Voice.start('en-US');
        this.voiceSubscription = Voice.onSpeechResults = (e) => {
          this.processAudioData(e);
        };
      }

      this.isTracking = true;
    } catch (error) {
      console.error('Failed to start sleep tracking:', error);
      throw error;
    }
  }

  async stopTracking(): Promise<SleepData> {
    if (!this.isTracking) {
      throw new Error('Sleep tracking is not active');
    }

    try {
      // Stop all sensors
      this.accelerometerSubscription?.unsubscribe();
      this.gyroscopeSubscription?.unsubscribe();
      if (Platform.OS === 'android') {
        await Voice.stop();
        this.voiceSubscription?.remove();
      }

      // Finalize sleep data
      if (this.currentSleepData) {
        this.currentSleepData.endTime = new Date();
        this.calculateSleepQuality();
        await this.saveSleepData(this.currentSleepData);
      }

      this.isTracking = false;
      return this.currentSleepData!;
    } catch (error) {
      console.error('Failed to stop sleep tracking:', error);
      throw error;
    }
  }

  private processMotionData(x: number, y: number, z: number): void {
    if (!this.currentSleepData) return;

    // Calculate movement intensity
    const intensity = Math.sqrt(x * x + y * y + z * z);
    
    // Determine sleep phase based on movement
    const phase = this.determineSleepPhase(intensity);
    
    // Update current sleep phase
    this.updateSleepPhase(phase);
  }

  private processGyroscopeData(x: number, y: number, z: number): void {
    if (!this.currentSleepData) return;

    // Process rotation data for additional sleep phase detection
    const rotation = Math.sqrt(x * x + y * y + z * z);
    // Add rotation-based sleep phase detection logic
  }

  private processAudioData(e: any): void {
    if (!this.currentSleepData) return;

    // Process audio data for snore detection
    const snoreEvent: SnoreEvent = {
      timestamp: new Date(),
      intensity: this.calculateSnoreIntensity(e),
      duration: 0, // Calculate duration based on audio data
    };

    this.currentSleepData.snoreEvents.push(snoreEvent);
  }

  private determineSleepPhase(intensity: number): 'light' | 'deep' | 'rem' | 'awake' {
    // Implement sleep phase detection algorithm
    // This is a simplified version - you should implement a more sophisticated algorithm
    if (intensity > 1.5) return 'awake';
    if (intensity > 0.8) return 'light';
    if (intensity > 0.3) return 'rem';
    return 'deep';
  }

  private updateSleepPhase(phase: 'light' | 'deep' | 'rem' | 'awake'): void {
    if (!this.currentSleepData) return;

    const currentPhase = this.currentSleepData.sleepPhases[this.currentSleepData.sleepPhases.length - 1];
    
    if (currentPhase && currentPhase.type === phase) {
      // Update end time of current phase
      currentPhase.endTime = new Date();
    } else {
      // Start new phase
      this.currentSleepData.sleepPhases.push({
        type: phase,
        startTime: new Date(),
        endTime: new Date(),
        confidence: this.calculateConfidence(phase),
      });
    }
  }

  private calculateConfidence(phase: 'light' | 'deep' | 'rem' | 'awake'): number {
    // Implement confidence calculation based on sensor data
    return 0.8; // Placeholder
  }

  private calculateSnoreIntensity(e: any): number {
    // Implement snore intensity calculation
    return 0.5; // Placeholder
  }

  private calculateSleepQuality(): void {
    if (!this.currentSleepData) return;

    // Calculate sleep quality score based on:
    // - Sleep duration
    // - Sleep phase distribution
    // - Snore events
    // - Movement patterns
    const duration = this.currentSleepData.endTime.getTime() - this.currentSleepData.startTime.getTime();
    const deepSleepPercentage = this.calculateDeepSleepPercentage();
    const snoreImpact = this.calculateSnoreImpact();

    this.currentSleepData.qualityScore = this.calculateQualityScore(
      duration,
      deepSleepPercentage,
      snoreImpact
    );
  }

  private calculateDeepSleepPercentage(): number {
    if (!this.currentSleepData) return 0;

    const deepSleepDuration = this.currentSleepData.sleepPhases
      .filter(phase => phase.type === 'deep')
      .reduce((total, phase) => {
        return total + (phase.endTime.getTime() - phase.startTime.getTime());
      }, 0);

    const totalDuration = this.currentSleepData.endTime.getTime() - this.currentSleepData.startTime.getTime();
    return (deepSleepDuration / totalDuration) * 100;
  }

  private calculateSnoreImpact(): number {
    if (!this.currentSleepData) return 0;

    // Calculate impact of snoring on sleep quality
    return this.currentSleepData.snoreEvents.reduce((total, event) => {
      return total + (event.intensity * event.duration);
    }, 0);
  }

  private calculateQualityScore(
    duration: number,
    deepSleepPercentage: number,
    snoreImpact: number
  ): number {
    // Implement quality score calculation
    // This is a simplified version - you should implement a more sophisticated algorithm
    const durationScore = Math.min(duration / (8 * 60 * 60 * 1000), 1) * 40;
    const deepSleepScore = (deepSleepPercentage / 25) * 40;
    const snoreScore = Math.max(0, 20 - (snoreImpact * 20));

    return durationScore + deepSleepScore + snoreScore;
  }

  private async saveSleepData(data: SleepData): Promise<void> {
    try {
      const sleepDataKey = `sleep_data_${data.startTime.toISOString()}`;
      await AsyncStorage.setItem(sleepDataKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save sleep data:', error);
      throw error;
    }
  }

  async getSleepHistory(): Promise<SleepData[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const sleepDataKeys = keys.filter(key => key.startsWith('sleep_data_'));
      const sleepData = await AsyncStorage.multiGet(sleepDataKeys);
      
      return sleepData
        .map(([_, value]) => JSON.parse(value!))
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    } catch (error) {
      console.error('Failed to get sleep history:', error);
      throw error;
    }
  }
}

export const sleepTrackingService = new SleepTrackingService(); 