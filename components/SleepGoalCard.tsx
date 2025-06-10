import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target } from 'lucide-react-native';
import { Circle } from 'react-native-progress';

interface SleepGoalCardProps {
  currentSleep: number;
  goalSleep: number;
  onPress?: () => void;
}

export default function SleepGoalCard({ currentSleep, goalSleep, onPress }: SleepGoalCardProps) {
  const progress = Math.min(currentSleep / goalSleep, 1);
  const percentage = Math.round(progress * 100);
  
  const getProgressColor = () => {
    if (percentage >= 100) return '#10b981';
    if (percentage >= 80) return '#3b82f6';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
      <LinearGradient
        colors={['rgba(167, 139, 250, 0.2)', 'rgba(139, 92, 246, 0.1)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Target color="#a78bfa" size={20} />
          <Text style={styles.title}>Sleep Goal</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Circle
            size={80}
            progress={progress}
            color={getProgressColor()}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            thickness={8}
            showsText={false}
          />
          
          <View style={styles.progressText}>
            <Text style={styles.percentage}>{percentage}%</Text>
          </View>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.current}>{currentSleep}h of {goalSleep}h</Text>
          <Text style={styles.status}>
            {percentage >= 100 ? '🎉 Goal achieved!' : 
             percentage >= 80 ? '💪 Almost there!' : 
             '😴 Keep going!'}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gradient: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  progressText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  details: {
    alignItems: 'center',
  },
  current: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#d1d5db',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
});