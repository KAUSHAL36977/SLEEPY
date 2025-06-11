import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, AppState } from 'react-native';

export interface SleepHabits {
  sleepSchedule: {
    weekdayBedtime: string;
    weekdayWakeTime: string;
    weekendBedtime: string;
    weekendWakeTime: string;
    consistencyScore: number;
  };
  sleepEfficiency: {
    averageSleepDuration: number;
    averageTimeInBed: number;
    efficiencyScore: number;
  };
  bedtimeRoutine: {
    activities: {
      type: 'screen' | 'reading' | 'meditation' | 'exercise' | 'other';
      duration: number;
      timeBeforeBed: number;
    }[];
    consistencyScore: number;
  };
  screenUsage: {
    lastScreenTime: number;
    averageEveningUsage: number;
    blueLightExposure: number;
  };
  physicalActivity: {
    dailySteps: number;
    exerciseDuration: number;
    exerciseTimeOfDay: string;
    activityScore: number;
  };
  stimulants: {
    caffeineIntake: {
      amount: number;
      time: string;
    }[];
    otherStimulants: string[];
  };
  napping: {
    frequency: number;
    averageDuration: number;
    latestNapTime: string;
  };
  sleepEnvironment: {
    noiseLevel: number;
    lightLevel: number;
    temperature: number;
    comfortScore: number;
  };
  sleepDisturbances: {
    awakenings: number;
    restlessness: number;
    snoringEvents: number;
    noiseEvents: number;
  };
  subjectiveMeasures: {
    sleepQuality: number;
    daytimeAlertness: number;
    mood: number;
  };
  chronotype: 'morning' | 'evening' | 'neutral';
  feedback: {
    recommendationEffectiveness: {
      [key: string]: number;
    };
    userNotes: string[];
  };
}

export class SleepHabitsService {
  private static instance: SleepHabitsService;
  private habits: SleepHabits | null = null;
  private appStateSubscription: any = null;
  private lastActiveTime: number = 0;

  private constructor() {}

  static getInstance(): SleepHabitsService {
    if (!SleepHabitsService.instance) {
      SleepHabitsService.instance = new SleepHabitsService();
    }
    return SleepHabitsService.instance;
  }

  async initialize(): Promise<void> {
    await this.loadHabits();
    this.initializeAppStateTracking();
  }

  private initializeAppStateTracking(): void {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      const now = Date.now();
      if (nextAppState === 'active') {
        this.lastActiveTime = now;
      } else if (nextAppState === 'background' && this.lastActiveTime > 0) {
        const screenTime = (now - this.lastActiveTime) / 1000; // Convert to seconds
        this.updateScreenUsage(screenTime);
      }
    });
  }

  private async loadHabits(): Promise<void> {
    try {
      const habitsJson = await AsyncStorage.getItem('sleep_habits');
      if (habitsJson) {
        this.habits = JSON.parse(habitsJson);
      } else {
        this.habits = this.getDefaultHabits();
        await this.saveHabits();
      }
    } catch (error) {
      console.error('Failed to load sleep habits:', error);
      this.habits = this.getDefaultHabits();
    }
  }

  private getDefaultHabits(): SleepHabits {
    return {
      sleepSchedule: {
        weekdayBedtime: '22:00',
        weekdayWakeTime: '06:00',
        weekendBedtime: '23:00',
        weekendWakeTime: '08:00',
        consistencyScore: 0,
      },
      sleepEfficiency: {
        averageSleepDuration: 0,
        averageTimeInBed: 0,
        efficiencyScore: 0,
      },
      bedtimeRoutine: {
        activities: [],
        consistencyScore: 0,
      },
      screenUsage: {
        lastScreenTime: 0,
        averageEveningUsage: 0,
        blueLightExposure: 0,
      },
      physicalActivity: {
        dailySteps: 0,
        exerciseDuration: 0,
        exerciseTimeOfDay: 'morning',
        activityScore: 0,
      },
      stimulants: {
        caffeineIntake: [],
        otherStimulants: [],
      },
      napping: {
        frequency: 0,
        averageDuration: 0,
        latestNapTime: '',
      },
      sleepEnvironment: {
        noiseLevel: 0,
        lightLevel: 0,
        temperature: 22,
        comfortScore: 0,
      },
      sleepDisturbances: {
        awakenings: 0,
        restlessness: 0,
        snoringEvents: 0,
        noiseEvents: 0,
      },
      subjectiveMeasures: {
        sleepQuality: 0,
        daytimeAlertness: 0,
        mood: 0,
      },
      chronotype: 'neutral',
      feedback: {
        recommendationEffectiveness: {},
        userNotes: [],
      },
    };
  }

  private async saveHabits(): Promise<void> {
    try {
      await AsyncStorage.setItem('sleep_habits', JSON.stringify(this.habits));
    } catch (error) {
      console.error('Failed to save sleep habits:', error);
    }
  }

  async updateSleepSchedule(schedule: Partial<SleepHabits['sleepSchedule']>): Promise<void> {
    if (!this.habits) return;
    this.habits.sleepSchedule = { ...this.habits.sleepSchedule, ...schedule };
    this.calculateConsistencyScore();
    await this.saveHabits();
  }

  async updateSleepEfficiency(efficiency: Partial<SleepHabits['sleepEfficiency']>): Promise<void> {
    if (!this.habits) return;
    this.habits.sleepEfficiency = { ...this.habits.sleepEfficiency, ...efficiency };
    this.calculateEfficiencyScore();
    await this.saveHabits();
  }

  async addBedtimeActivity(activity: SleepHabits['bedtimeRoutine']['activities'][0]): Promise<void> {
    if (!this.habits) return;
    this.habits.bedtimeRoutine.activities.push(activity);
    this.calculateRoutineConsistency();
    await this.saveHabits();
  }

  private updateScreenUsage(screenTime: number): void {
    if (!this.habits) return;
    this.habits.screenUsage.lastScreenTime = screenTime;
    this.calculateBlueLightExposure();
    this.saveHabits();
  }

  async updatePhysicalActivity(activity: Partial<SleepHabits['physicalActivity']>): Promise<void> {
    if (!this.habits) return;
    this.habits.physicalActivity = { ...this.habits.physicalActivity, ...activity };
    this.calculateActivityScore();
    await this.saveHabits();
  }

  async addCaffeineIntake(intake: SleepHabits['stimulants']['caffeineIntake'][0]): Promise<void> {
    if (!this.habits) return;
    this.habits.stimulants.caffeineIntake.push(intake);
    await this.saveHabits();
  }

  async updateNapping(napping: Partial<SleepHabits['napping']>): Promise<void> {
    if (!this.habits) return;
    this.habits.napping = { ...this.habits.napping, ...napping };
    await this.saveHabits();
  }

  async updateSleepEnvironment(environment: Partial<SleepHabits['sleepEnvironment']>): Promise<void> {
    if (!this.habits) return;
    this.habits.sleepEnvironment = { ...this.habits.sleepEnvironment, ...environment };
    this.calculateComfortScore();
    await this.saveHabits();
  }

  async updateSleepDisturbances(disturbances: Partial<SleepHabits['sleepDisturbances']>): Promise<void> {
    if (!this.habits) return;
    this.habits.sleepDisturbances = { ...this.habits.sleepDisturbances, ...disturbances };
    await this.saveHabits();
  }

  async updateSubjectiveMeasures(measures: Partial<SleepHabits['subjectiveMeasures']>): Promise<void> {
    if (!this.habits) return;
    this.habits.subjectiveMeasures = { ...this.habits.subjectiveMeasures, ...measures };
    await this.saveHabits();
  }

  async updateChronotype(chronotype: SleepHabits['chronotype']): Promise<void> {
    if (!this.habits) return;
    this.habits.chronotype = chronotype;
    await this.saveHabits();
  }

  async addFeedback(effectiveness: { [key: string]: number }, note?: string): Promise<void> {
    if (!this.habits) return;
    this.habits.feedback.recommendationEffectiveness = {
      ...this.habits.feedback.recommendationEffectiveness,
      ...effectiveness,
    };
    if (note) {
      this.habits.feedback.userNotes.push(note);
    }
    await this.saveHabits();
  }

  private calculateConsistencyScore(): void {
    if (!this.habits) return;
    const weekdayBedtime = new Date(`2000-01-01T${this.habits.sleepSchedule.weekdayBedtime}`);
    const weekendBedtime = new Date(`2000-01-01T${this.habits.sleepSchedule.weekendBedtime}`);
    const weekdayWake = new Date(`2000-01-01T${this.habits.sleepSchedule.weekdayWakeTime}`);
    const weekendWake = new Date(`2000-01-01T${this.habits.sleepSchedule.weekendWakeTime}`);

    const bedtimeDiff = Math.abs(weekdayBedtime.getTime() - weekendBedtime.getTime()) / (1000 * 60 * 60);
    const wakeDiff = Math.abs(weekdayWake.getTime() - weekendWake.getTime()) / (1000 * 60 * 60);

    // Score decreases as the difference between weekday and weekend schedules increases
    this.habits.sleepSchedule.consistencyScore = Math.max(0, 100 - (bedtimeDiff + wakeDiff) * 10);
  }

  private calculateEfficiencyScore(): void {
    if (!this.habits) return;
    const { averageSleepDuration, averageTimeInBed } = this.habits.sleepEfficiency;
    if (averageTimeInBed === 0) return;

    const efficiency = (averageSleepDuration / averageTimeInBed) * 100;
    this.habits.sleepEfficiency.efficiencyScore = Math.min(100, efficiency);
  }

  private calculateRoutineConsistency(): void {
    if (!this.habits) return;
    const activities = this.habits.bedtimeRoutine.activities;
    if (activities.length === 0) return;

    // Calculate consistency based on the number of unique activities and their frequency
    const uniqueActivities = new Set(activities.map(a => a.type)).size;
    const totalActivities = activities.length;
    this.habits.bedtimeRoutine.consistencyScore = (uniqueActivities / totalActivities) * 100;
  }

  private calculateBlueLightExposure(): void {
    if (!this.habits) return;
    const { lastScreenTime, averageEveningUsage } = this.habits.screenUsage;
    this.habits.screenUsage.blueLightExposure = (lastScreenTime + averageEveningUsage) / 2;
  }

  private calculateActivityScore(): void {
    if (!this.habits) return;
    const { dailySteps, exerciseDuration } = this.habits.physicalActivity;
    
    // Calculate score based on steps and exercise duration
    const stepsScore = Math.min(100, (dailySteps / 10000) * 50);
    const exerciseScore = Math.min(50, (exerciseDuration / 60) * 50);
    
    this.habits.physicalActivity.activityScore = stepsScore + exerciseScore;
  }

  private calculateComfortScore(): void {
    if (!this.habits) return;
    const { noiseLevel, lightLevel, temperature } = this.habits.sleepEnvironment;
    
    // Ideal conditions: low noise, low light, temperature between 18-22°C
    const noiseScore = Math.max(0, 100 - (noiseLevel * 10));
    const lightScore = Math.max(0, 100 - (lightLevel * 10));
    const tempScore = Math.max(0, 100 - Math.abs(temperature - 20) * 10);
    
    this.habits.sleepEnvironment.comfortScore = (noiseScore + lightScore + tempScore) / 3;
  }

  getHabits(): SleepHabits | null {
    return this.habits;
  }

  async generateRecommendations(): Promise<string[]> {
    if (!this.habits) return [];

    const recommendations: string[] = [];

    // Sleep schedule recommendations
    if (this.habits.sleepSchedule.consistencyScore < 70) {
      recommendations.push(
        'Try to maintain a more consistent sleep schedule between weekdays and weekends.'
      );
    }

    // Sleep efficiency recommendations
    if (this.habits.sleepEfficiency.efficiencyScore < 85) {
      recommendations.push(
        'Your sleep efficiency could be improved. Consider reducing time spent in bed while awake.'
      );
    }

    // Screen usage recommendations
    if (this.habits.screenUsage.blueLightExposure > 60) {
      recommendations.push(
        'Reduce screen time before bed to minimize blue light exposure.'
      );
    }

    // Physical activity recommendations
    if (this.habits.physicalActivity.activityScore < 50) {
      recommendations.push(
        'Increase daily physical activity to improve sleep quality.'
      );
    }

    // Caffeine recommendations
    const lateCaffeine = this.habits.stimulants.caffeineIntake.some(
      intake => new Date(`2000-01-01T${intake.time}`).getHours() >= 14
    );
    if (lateCaffeine) {
      recommendations.push(
        'Avoid consuming caffeine after 2 PM to prevent sleep disruption.'
      );
    }

    // Napping recommendations
    if (this.habits.napping.frequency > 3 || 
        new Date(`2000-01-01T${this.habits.napping.latestNapTime}`).getHours() >= 16) {
      recommendations.push(
        'Limit naps to earlier in the day and keep them under 30 minutes.'
      );
    }

    // Environment recommendations
    if (this.habits.sleepEnvironment.comfortScore < 70) {
      recommendations.push(
        'Optimize your sleep environment by adjusting temperature, light, and noise levels.'
      );
    }

    return recommendations;
  }
} 