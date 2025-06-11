import AsyncStorage from '@react-native-async-storage/async-storage';
import { SleepHabitsService } from './SleepHabitsService';

interface SleepPattern {
  averageSleepDuration: number;
  sleepEfficiency: number;
  consistencyScore: number;
  qualityScore: number;
  disturbances: number;
  recoveryScore: number;
}

interface Correlation {
  factor: string;
  impact: number;
  confidence: number;
}

interface PersonalizedRecommendation {
  title: string;
  description: string;
  priority: number;
  impact: number;
  evidence: string[];
}

export class SleepAnalysisService {
  private static instance: SleepAnalysisService;
  private habitsService: SleepHabitsService;
  private readonly STORAGE_KEY = '@sleep_analysis_data';

  private constructor() {
    this.habitsService = SleepHabitsService.getInstance();
  }

  public static getInstance(): SleepAnalysisService {
    if (!SleepAnalysisService.instance) {
      SleepAnalysisService.instance = new SleepAnalysisService();
    }
    return SleepAnalysisService.instance;
  }

  public async analyzeSleepPatterns(): Promise<SleepPattern> {
    const habits = this.habitsService.getHabits();
    
    // Calculate average sleep duration
    const weekdayDuration = this.calculateDuration(
      habits.sleepSchedule.weekdayBedtime,
      habits.sleepSchedule.weekdayWakeTime
    );
    const weekendDuration = this.calculateDuration(
      habits.sleepSchedule.weekendBedtime,
      habits.sleepSchedule.weekendWakeTime
    );
    const averageSleepDuration = (weekdayDuration * 5 + weekendDuration * 2) / 7;

    // Calculate sleep efficiency
    const sleepEfficiency = this.calculateSleepEfficiency(habits);

    // Calculate consistency score
    const consistencyScore = this.calculateConsistencyScore(habits);

    // Calculate quality score
    const qualityScore = this.calculateQualityScore(habits);

    // Calculate disturbances
    const disturbances = this.calculateDisturbances(habits);

    // Calculate recovery score
    const recoveryScore = this.calculateRecoveryScore(habits);

    return {
      averageSleepDuration,
      sleepEfficiency,
      consistencyScore,
      qualityScore,
      disturbances,
      recoveryScore,
    };
  }

  public async findCorrelations(): Promise<Correlation[]> {
    const habits = this.habitsService.getHabits();
    const correlations: Correlation[] = [];

    // Analyze caffeine impact
    const caffeineImpact = this.analyzeCaffeineImpact(habits);
    if (caffeineImpact.impact > 0) {
      correlations.push({
        factor: 'Caffeine Intake',
        impact: caffeineImpact.impact,
        confidence: caffeineImpact.confidence,
      });
    }

    // Analyze exercise impact
    const exerciseImpact = this.analyzeExerciseImpact(habits);
    if (exerciseImpact.impact > 0) {
      correlations.push({
        factor: 'Physical Activity',
        impact: exerciseImpact.impact,
        confidence: exerciseImpact.confidence,
      });
    }

    // Analyze screen time impact
    const screenTimeImpact = this.analyzeScreenTimeImpact(habits);
    if (screenTimeImpact.impact > 0) {
      correlations.push({
        factor: 'Screen Time',
        impact: screenTimeImpact.impact,
        confidence: screenTimeImpact.confidence,
      });
    }

    // Analyze environment impact
    const environmentImpact = this.analyzeEnvironmentImpact(habits);
    if (environmentImpact.impact > 0) {
      correlations.push({
        factor: 'Sleep Environment',
        impact: environmentImpact.impact,
        confidence: environmentImpact.confidence,
      });
    }

    return correlations.sort((a, b) => b.impact - a.impact);
  }

  public async generatePersonalizedRecommendations(): Promise<PersonalizedRecommendation[]> {
    const patterns = await this.analyzeSleepPatterns();
    const correlations = await this.findCorrelations();
    const recommendations: PersonalizedRecommendation[] = [];

    // Sleep duration recommendations
    if (patterns.averageSleepDuration < 7) {
      recommendations.push({
        title: 'Increase Sleep Duration',
        description: 'Your average sleep duration is below the recommended 7-9 hours. Try going to bed 30 minutes earlier.',
        priority: 1,
        impact: 0.8,
        evidence: ['Sleep duration below recommended range', 'Consistency score affected'],
      });
    }

    // Sleep efficiency recommendations
    if (patterns.sleepEfficiency < 0.85) {
      recommendations.push({
        title: 'Improve Sleep Efficiency',
        description: 'Your sleep efficiency could be improved. Consider reducing time in bed when not sleeping.',
        priority: 2,
        impact: 0.7,
        evidence: ['Sleep efficiency below optimal range', 'Time spent awake in bed'],
      });
    }

    // Add recommendations based on correlations
    correlations.forEach(correlation => {
      if (correlation.impact > 0.5) {
        recommendations.push(this.generateCorrelationBasedRecommendation(correlation));
      }
    });

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  private calculateDuration(bedtime: string, wakeTime: string): number {
    const [bedHour, bedMinute] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    
    let duration = (wakeHour - bedHour) * 60 + (wakeMinute - bedMinute);
    if (duration < 0) duration += 24 * 60;
    return duration / 60; // Convert to hours
  }

  private calculateSleepEfficiency(habits: any): number {
    const timeInBed = this.calculateDuration(
      habits.sleepSchedule.weekdayBedtime,
      habits.sleepSchedule.weekdayWakeTime
    );
    const actualSleep = timeInBed - (habits.sleepEfficiency.awakeTime || 0);
    return actualSleep / timeInBed;
  }

  private calculateConsistencyScore(habits: any): number {
    const weekdayBedtime = new Date(`2000-01-01T${habits.sleepSchedule.weekdayBedtime}`);
    const weekendBedtime = new Date(`2000-01-01T${habits.sleepSchedule.weekendBedtime}`);
    const weekdayWake = new Date(`2000-01-01T${habits.sleepSchedule.weekdayWakeTime}`);
    const weekendWake = new Date(`2000-01-01T${habits.sleepSchedule.weekendWakeTime}`);

    const bedtimeDiff = Math.abs(weekdayBedtime.getTime() - weekendBedtime.getTime()) / (1000 * 60 * 60);
    const wakeDiff = Math.abs(weekdayWake.getTime() - weekendWake.getTime()) / (1000 * 60 * 60);

    return 100 - ((bedtimeDiff + wakeDiff) * 10);
  }

  private calculateQualityScore(habits: any): number {
    const factors = [
      habits.sleepEnvironment.comfortScore,
      habits.sleepEfficiency.efficiencyScore,
      habits.sleepSchedule.consistencyScore,
    ];
    return factors.reduce((sum, score) => sum + score, 0) / factors.length;
  }

  private calculateDisturbances(habits: any): number {
    return habits.sleepEnvironment.noiseLevel + 
           habits.sleepEnvironment.lightLevel + 
           (habits.sleepEnvironment.temperature > 24 ? 2 : 0);
  }

  private calculateRecoveryScore(habits: any): number {
    const qualityScore = this.calculateQualityScore(habits);
    const disturbances = this.calculateDisturbances(habits);
    const efficiency = this.calculateSleepEfficiency(habits);

    return (qualityScore * 0.4 + (100 - disturbances * 10) * 0.3 + efficiency * 100 * 0.3);
  }

  private analyzeCaffeineImpact(habits: any): { impact: number; confidence: number } {
    const caffeineIntake = habits.stimulants.caffeineIntake;
    if (!caffeineIntake || caffeineIntake.length === 0) {
      return { impact: 0, confidence: 0 };
    }

    const lateIntake = caffeineIntake.filter((intake: any) => {
      const [hour] = intake.time.split(':').map(Number);
      return hour >= 14; // After 2 PM
    });

    const impact = (lateIntake.length / caffeineIntake.length) * 0.8;
    const confidence = 0.7;

    return { impact, confidence };
  }

  private analyzeExerciseImpact(habits: any): { impact: number; confidence: number } {
    const activity = habits.physicalActivity;
    const impact = activity.exerciseDuration < 30 ? 0.6 : 0;
    const confidence = 0.8;

    return { impact, confidence };
  }

  private analyzeScreenTimeImpact(habits: any): { impact: number; confidence: number } {
    const screenUsage = habits.screenUsage;
    const impact = screenUsage.bedtimeScreenTime > 30 ? 0.7 : 0;
    const confidence = 0.9;

    return { impact, confidence };
  }

  private analyzeEnvironmentImpact(habits: any): { impact: number; confidence: number } {
    const environment = habits.sleepEnvironment;
    const impact = environment.noiseLevel > 5 || environment.lightLevel > 5 ? 0.6 : 0;
    const confidence = 0.8;

    return { impact, confidence };
  }

  private generateCorrelationBasedRecommendation(correlation: Correlation): PersonalizedRecommendation {
    const recommendations: { [key: string]: PersonalizedRecommendation } = {
      'Caffeine Intake': {
        title: 'Optimize Caffeine Consumption',
        description: 'Consider limiting caffeine intake to before 2 PM to improve sleep quality.',
        priority: 2,
        impact: correlation.impact,
        evidence: ['Late caffeine consumption affects sleep onset', 'Sleep quality correlation'],
      },
      'Physical Activity': {
        title: 'Increase Physical Activity',
        description: 'Aim for at least 30 minutes of moderate exercise daily to improve sleep quality.',
        priority: 2,
        impact: correlation.impact,
        evidence: ['Exercise duration below recommended', 'Sleep quality correlation'],
      },
      'Screen Time': {
        title: 'Reduce Evening Screen Time',
        description: 'Limit screen time to 30 minutes before bedtime to improve sleep onset.',
        priority: 1,
        impact: correlation.impact,
        evidence: ['High bedtime screen usage', 'Sleep onset correlation'],
      },
      'Sleep Environment': {
        title: 'Optimize Sleep Environment',
        description: 'Reduce noise and light levels in your bedroom for better sleep quality.',
        priority: 2,
        impact: correlation.impact,
        evidence: ['Environmental factors affecting sleep', 'Sleep quality correlation'],
      },
    };

    return recommendations[correlation.factor] || {
      title: 'General Sleep Improvement',
      description: 'Consider reviewing your sleep habits for potential improvements.',
      priority: 3,
      impact: correlation.impact,
      evidence: ['Sleep quality correlation', 'General sleep patterns'],
    };
  }
} 