import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SleepHabitsService, SleepHabits } from '../services/SleepHabitsService';
import { Card, StyledText, Button } from './styled';

export const SleepHabitsComponent: React.FC = () => {
  const { colors } = useTheme();
  const [habits, setHabits] = useState<SleepHabits | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const habitsService = SleepHabitsService.getInstance();

  useEffect(() => {
    initializeHabits();
  }, []);

  const initializeHabits = async () => {
    await habitsService.initialize();
    const currentHabits = habitsService.getHabits();
    setHabits(currentHabits);
    const recs = await habitsService.generateRecommendations();
    setRecommendations(recs);
  };

  const handleUpdateSleepSchedule = async (schedule: Partial<SleepHabits['sleepSchedule']>) => {
    try {
      await habitsService.updateSleepSchedule(schedule);
      const updatedHabits = habitsService.getHabits();
      setHabits(updatedHabits);
      const recs = await habitsService.generateRecommendations();
      setRecommendations(recs);
    } catch (error) {
      Alert.alert('Error', 'Failed to update sleep schedule');
    }
  };

  const handleUpdateSleepEnvironment = async (environment: Partial<SleepHabits['sleepEnvironment']>) => {
    try {
      await habitsService.updateSleepEnvironment(environment);
      const updatedHabits = habitsService.getHabits();
      setHabits(updatedHabits);
      const recs = await habitsService.generateRecommendations();
      setRecommendations(recs);
    } catch (error) {
      Alert.alert('Error', 'Failed to update sleep environment');
    }
  };

  const handleAddCaffeineIntake = async (intake: SleepHabits['stimulants']['caffeineIntake'][0]) => {
    try {
      await habitsService.addCaffeineIntake(intake);
      const updatedHabits = habitsService.getHabits();
      setHabits(updatedHabits);
      const recs = await habitsService.generateRecommendations();
      setRecommendations(recs);
    } catch (error) {
      Alert.alert('Error', 'Failed to add caffeine intake');
    }
  };

  if (!habits) {
    return (
      <View style={styles.container}>
        <StyledText>Loading sleep habits...</StyledText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Sleep Schedule */}
      <Card style={styles.section}>
        <StyledText variant="h2">Sleep Schedule</StyledText>
        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleItem}>
            <StyledText>Weekday Bedtime</StyledText>
            <StyledText>{habits.sleepSchedule.weekdayBedtime}</StyledText>
          </View>
          <View style={styles.scheduleItem}>
            <StyledText>Weekday Wake Time</StyledText>
            <StyledText>{habits.sleepSchedule.weekdayWakeTime}</StyledText>
          </View>
          <View style={styles.scheduleItem}>
            <StyledText>Weekend Bedtime</StyledText>
            <StyledText>{habits.sleepSchedule.weekendBedtime}</StyledText>
          </View>
          <View style={styles.scheduleItem}>
            <StyledText>Weekend Wake Time</StyledText>
            <StyledText>{habits.sleepSchedule.weekendWakeTime}</StyledText>
          </View>
        </View>
        <StyledText>Consistency Score: {habits.sleepSchedule.consistencyScore}%</StyledText>
      </Card>

      {/* Sleep Environment */}
      <Card style={styles.section}>
        <StyledText variant="h2">Sleep Environment</StyledText>
        <View style={styles.environmentContainer}>
          <View style={styles.environmentItem}>
            <StyledText>Noise Level</StyledText>
            <StyledText>{habits.sleepEnvironment.noiseLevel}/10</StyledText>
          </View>
          <View style={styles.environmentItem}>
            <StyledText>Light Level</StyledText>
            <StyledText>{habits.sleepEnvironment.lightLevel}/10</StyledText>
          </View>
          <View style={styles.environmentItem}>
            <StyledText>Temperature</StyledText>
            <StyledText>{habits.sleepEnvironment.temperature}°C</StyledText>
          </View>
        </View>
        <StyledText>Comfort Score: {habits.sleepEnvironment.comfortScore}%</StyledText>
      </Card>

      {/* Physical Activity */}
      <Card style={styles.section}>
        <StyledText variant="h2">Physical Activity</StyledText>
        <View style={styles.activityContainer}>
          <View style={styles.activityItem}>
            <StyledText>Daily Steps</StyledText>
            <StyledText>{habits.physicalActivity.dailySteps}</StyledText>
          </View>
          <View style={styles.activityItem}>
            <StyledText>Exercise Duration</StyledText>
            <StyledText>{habits.physicalActivity.exerciseDuration} minutes</StyledText>
          </View>
          <View style={styles.activityItem}>
            <StyledText>Exercise Time</StyledText>
            <StyledText>{habits.physicalActivity.exerciseTimeOfDay}</StyledText>
          </View>
        </View>
        <StyledText>Activity Score: {habits.physicalActivity.activityScore}%</StyledText>
      </Card>

      {/* Recommendations */}
      <Card style={styles.section}>
        <StyledText variant="h2">Recommendations</StyledText>
        {recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <StyledText>• {recommendation}</StyledText>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  scheduleContainer: {
    marginVertical: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  environmentContainer: {
    marginVertical: 16,
  },
  environmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activityContainer: {
    marginVertical: 16,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recommendationItem: {
    marginVertical: 8,
  },
}); 