export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  mood: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  tags?: string[];
}

export interface SleepGoal {
  targetDuration: number;
  bedtime: string;
  wakeTime: string;
  consistency: boolean;
}

export interface SleepStats {
  averageDuration: number;
  averageQuality: number;
  streak: number;
  goalAchievementRate: number;
  totalNights: number;
}

export interface SleepSound {
  id: number;
  name: string;
  category: 'nature' | 'white-noise' | 'music' | 'binaural';
  duration: number | 'infinite';
  premium: boolean;
  url?: string;
}

export interface UserSettings {
  notifications: boolean;
  bedtimeReminders: boolean;
  reminderTime: string;
  darkMode: boolean;
  soundQuality: 'standard' | 'high';
  dataSync: boolean;
  premium: boolean;
}