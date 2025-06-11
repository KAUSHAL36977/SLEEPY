export interface SleepData {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  qualityScore: number;
  phases: SleepPhase[];
  snoreEvents: SnoreEvent[];
  heartRateData: HeartRateData[];
}

export interface SleepPhase {
  type: 'light' | 'deep' | 'rem' | 'awake';
  startTime: Date;
  endTime: Date;
  duration: number;
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

export interface SleepHabits {
  sleepSchedule: {
    bedtime: Date;
    wakeTime: Date;
    consistency: number; // 0-100
  };
  efficiency: {
    timeToFallAsleep: number;
    wakeUps: number;
    totalAwakeTime: number;
  };
  bedtimeRoutine: {
    duration: number;
    activities: string[];
    consistency: number; // 0-100
  };
  screenUsage: {
    totalScreenTime: number;
    lastScreenTime: Date;
    blueLightExposure: number; // 0-100
  };
  physicalActivity: {
    dailySteps: number;
    exerciseTime: number;
    exerciseIntensity: 'low' | 'medium' | 'high';
  };
  stimulants: {
    caffeineIntake: number;
    alcoholIntake: number;
    nicotineUse: boolean;
  };
  napping: {
    frequency: number;
    averageDuration: number;
    lastNapTime: Date | null;
  };
  environment: {
    temperature: number;
    lightLevel: number; // 0-1
    noiseLevel: number; // 0-1
    comfort: number; // 0-100
  };
  disturbances: {
    frequency: number;
    types: string[];
    impact: number; // 0-100
  };
  subjective: {
    stressLevel: number; // 0-100
    mood: 'poor' | 'fair' | 'good' | 'excellent';
    energyLevel: number; // 0-100
  };
  chronotype: {
    type: 'early' | 'intermediate' | 'late';
    preference: number; // 0-100
  };
  feedback: {
    sleepQuality: number; // 0-100
    satisfaction: number; // 0-100
    comments: string;
  };
} 