import { SleepEntry, SleepStats } from '@/types/sleep';

export const calculateSleepDuration = (bedtime: string, wakeTime: string): number => {
  const bed = new Date(`2000-01-01 ${bedtime}`);
  let wake = new Date(`2000-01-01 ${wakeTime}`);
  
  // Handle overnight sleep
  if (wake <= bed) {
    wake.setDate(wake.getDate() + 1);
  }
  
  const duration = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);
  return Math.round(duration * 10) / 10;
};

export const getSleepQualityColor = (quality: string): string => {
  switch (quality.toLowerCase()) {
    case 'excellent': return '#10b981';
    case 'good': return '#3b82f6';
    case 'fair': return '#f59e0b';
    case 'poor': return '#ef4444';
    default: return '#9ca3af';
  }
};

export const getMoodEmoji = (mood: number): string => {
  switch (mood) {
    case 5: return '😊';
    case 4: return '🙂';
    case 3: return '😐';
    case 2: return '😔';
    case 1: return '😰';
    default: return '😐';
  }
};

export const calculateSleepStats = (entries: SleepEntry[]): SleepStats => {
  if (entries.length === 0) {
    return {
      averageDuration: 0,
      averageQuality: 0,
      streak: 0,
      goalAchievementRate: 0,
      totalNights: 0,
    };
  }

  const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
  const averageDuration = totalDuration / entries.length;

  const qualityScores = entries.map(entry => {
    switch (entry.quality) {
      case 'excellent': return 4;
      case 'good': return 3;
      case 'fair': return 2;
      case 'poor': return 1;
      default: return 0;
    }
  });
  const averageQuality = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;

  // Calculate streak (simplified - assumes entries are sorted by date)
  let streak = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].duration >= 7) { // Assuming 7+ hours is goal achievement
      streak++;
    } else {
      break;
    }
  }

  const goalAchievements = entries.filter(entry => entry.duration >= 7).length;
  const goalAchievementRate = (goalAchievements / entries.length) * 100;

  return {
    averageDuration: Math.round(averageDuration * 10) / 10,
    averageQuality: Math.round(averageQuality * 10) / 10,
    streak,
    goalAchievementRate: Math.round(goalAchievementRate),
    totalNights: entries.length,
  };
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  
  return `${hour12}:${minutes} ${ampm}`;
};

export const generateSleepInsights = (entries: SleepEntry[]): string[] => {
  if (entries.length < 7) return ['Track more nights to get personalized insights!'];

  const insights: string[] = [];
  const stats = calculateSleepStats(entries);
  
  if (stats.averageDuration < 7) {
    insights.push('Try going to bed 30 minutes earlier to improve sleep duration');
  }
  
  if (stats.goalAchievementRate > 80) {
    insights.push('Excellent consistency! Your sleep routine is working well');
  }
  
  if (stats.streak > 7) {
    insights.push(`Amazing ${stats.streak}-day streak! Keep up the great work`);
  }
  
  // Add more insight logic based on patterns
  return insights.length > 0 ? insights : ['Your sleep patterns look healthy!'];
};