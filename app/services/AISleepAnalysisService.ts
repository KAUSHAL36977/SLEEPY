import { SleepData, SleepPhase, SleepHabits } from '../types/sleep';
import { Platform } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

interface SleepInsight {
  type: 'quality' | 'duration' | 'consistency' | 'environment' | 'lifestyle';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  impact: number; // 0-100 scale
}

interface SleepPattern {
  pattern: string;
  confidence: number;
  explanation: string;
}

export class AISleepAnalysisService {
  private model: tf.LayersModel | null = null;
  private isModelLoaded: boolean = false;

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      await tf.ready();
      // Load pre-trained model for sleep pattern analysis
      // Note: In production, you would load your actual trained model
      this.isModelLoaded = true;
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
    }
  }

  async analyzeSleepData(sleepData: SleepData, habits: SleepHabits): Promise<SleepInsight[]> {
    if (!this.isModelLoaded) {
      throw new Error('AI model not initialized');
    }

    const insights: SleepInsight[] = [];

    // Analyze sleep quality
    const qualityInsight = this.analyzeSleepQuality(sleepData);
    if (qualityInsight) insights.push(qualityInsight);

    // Analyze sleep patterns
    const patternInsight = this.analyzeSleepPatterns(sleepData);
    if (patternInsight) insights.push(patternInsight);

    // Analyze environmental factors
    const environmentInsight = this.analyzeEnvironmentalFactors(habits);
    if (environmentInsight) insights.push(environmentInsight);

    // Analyze lifestyle impact
    const lifestyleInsight = this.analyzeLifestyleImpact(habits);
    if (lifestyleInsight) insights.push(lifestyleInsight);

    return insights;
  }

  private analyzeSleepQuality(sleepData: SleepData): SleepInsight | null {
    const qualityScore = sleepData.qualityScore;
    const deepSleepPercentage = this.calculateDeepSleepPercentage(sleepData.phases);

    if (qualityScore < 70 || deepSleepPercentage < 20) {
      return {
        type: 'quality',
        title: 'Sleep Quality Needs Improvement',
        description: `Your sleep quality score is ${qualityScore}%, and deep sleep percentage is ${deepSleepPercentage}%.`,
        severity: qualityScore < 50 ? 'high' : 'medium',
        recommendations: [
          'Maintain a consistent sleep schedule',
          'Create a relaxing bedtime routine',
          'Optimize your sleep environment',
          'Limit screen time before bed'
        ],
        impact: 100 - qualityScore
      };
    }

    return null;
  }

  private analyzeSleepPatterns(sleepData: SleepData): SleepInsight | null {
    const patterns = this.detectSleepPatterns(sleepData);
    
    if (patterns.some(p => p.confidence > 0.7)) {
      const mainPattern = patterns.reduce((a, b) => a.confidence > b.confidence ? a : b);
      return {
        type: 'consistency',
        title: 'Sleep Pattern Detected',
        description: mainPattern.explanation,
        severity: 'low',
        recommendations: this.generatePatternRecommendations(mainPattern.pattern),
        impact: 50
      };
    }

    return null;
  }

  private analyzeEnvironmentalFactors(habits: SleepHabits): SleepInsight | null {
    const issues = [];

    if (habits.environment.temperature > 24) {
      issues.push('Room temperature is too high');
    }
    if (habits.environment.lightLevel > 0.3) {
      issues.push('Room is too bright');
    }
    if (habits.environment.noiseLevel > 0.5) {
      issues.push('Room is too noisy');
    }

    if (issues.length > 0) {
      return {
        type: 'environment',
        title: 'Sleep Environment Issues',
        description: issues.join(', '),
        severity: issues.length > 2 ? 'high' : 'medium',
        recommendations: [
          'Maintain room temperature between 18-22°C',
          'Use blackout curtains',
          'Consider white noise machine',
          'Use earplugs if needed'
        ],
        impact: issues.length * 20
      };
    }

    return null;
  }

  private analyzeLifestyleImpact(habits: SleepHabits): SleepInsight | null {
    const issues = [];

    if (habits.stimulants.caffeineIntake > 200) {
      issues.push('High caffeine intake');
    }
    if (habits.physicalActivity.dailySteps < 5000) {
      issues.push('Low physical activity');
    }
    if (habits.screenUsage.totalScreenTime > 3600) {
      issues.push('Excessive screen time');
    }

    if (issues.length > 0) {
      return {
        type: 'lifestyle',
        title: 'Lifestyle Factors Affecting Sleep',
        description: issues.join(', '),
        severity: issues.length > 2 ? 'high' : 'medium',
        recommendations: [
          'Limit caffeine after 2 PM',
          'Aim for 10,000 steps daily',
          'Reduce screen time before bed',
          'Exercise regularly but not close to bedtime'
        ],
        impact: issues.length * 25
      };
    }

    return null;
  }

  private calculateDeepSleepPercentage(phases: SleepPhase[]): number {
    const deepSleepDuration = phases
      .filter(phase => phase.type === 'deep')
      .reduce((total, phase) => total + phase.duration, 0);
    
    const totalSleepDuration = phases.reduce((total, phase) => total + phase.duration, 0);
    return (deepSleepDuration / totalSleepDuration) * 100;
  }

  private detectSleepPatterns(sleepData: SleepData): SleepPattern[] {
    // Implement pattern detection logic using the AI model
    // This is a placeholder implementation
    return [
      {
        pattern: 'consistent_schedule',
        confidence: 0.85,
        explanation: 'You maintain a consistent sleep schedule'
      },
      {
        pattern: 'late_night_awakening',
        confidence: 0.65,
        explanation: 'You tend to wake up during the night'
      }
    ];
  }

  private generatePatternRecommendations(pattern: string): string[] {
    const recommendations: { [key: string]: string[] } = {
      consistent_schedule: [
        'Keep your current sleep schedule',
        'Maintain your bedtime routine'
      ],
      late_night_awakening: [
        'Limit fluid intake before bed',
        'Practice relaxation techniques',
        'Consider sleep restriction therapy'
      ]
    };

    return recommendations[pattern] || [];
  }

  async predictOptimalSleepTime(habits: SleepHabits): Promise<Date> {
    // Implement sleep time prediction using the AI model
    // This is a placeholder implementation
    const now = new Date();
    return new Date(now.setHours(22, 0, 0, 0));
  }

  async generateSleepReport(sleepData: SleepData, habits: SleepHabits): Promise<string> {
    const insights = await this.analyzeSleepData(sleepData, habits);
    const optimalSleepTime = await this.predictOptimalSleepTime(habits);

    return `
Sleep Analysis Report
====================

Sleep Quality: ${sleepData.qualityScore}%
Total Sleep Duration: ${sleepData.duration} minutes
Deep Sleep: ${this.calculateDeepSleepPercentage(sleepData.phases)}%

Key Insights:
${insights.map(insight => `
- ${insight.title}
  ${insight.description}
  Severity: ${insight.severity}
  Impact: ${insight.impact}%
  Recommendations:
  ${insight.recommendations.map(rec => `  * ${rec}`).join('\n')}
`).join('\n')}

Optimal Sleep Time: ${optimalSleepTime.toLocaleTimeString()}

Note: This report is generated using AI analysis and should be used as a guide.
Consult with healthcare professionals for medical advice.
    `;
  }
} 