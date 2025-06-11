import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Container, Card, Text, Button } from '../components/styled';
import { SleepTracking } from '../components/SleepTracking';
import { SleepInsights } from '../components/SleepInsights';
import { SleepTrackingService } from '../services/SleepTrackingService';
import { SleepHabitsService } from '../services/SleepHabitsService';
import { SleepData, SleepHabits } from '../types/sleep';
import { useTheme } from '../components/styled';

export default function SleepTrackingScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [sleepData, setSleepData] = useState<SleepData | null>(null);
  const [habits, setHabits] = useState<SleepHabits | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const theme = useTheme();

  const sleepTrackingService = new SleepTrackingService();
  const sleepHabitsService = new SleepHabitsService();

  useEffect(() => {
    loadLatestSleepData();
    loadSleepHabits();
  }, []);

  const loadLatestSleepData = async () => {
    try {
      const data = await sleepTrackingService.getLatestSleepData();
      setSleepData(data);
    } catch (error) {
      console.error('Failed to load sleep data:', error);
    }
  };

  const loadSleepHabits = async () => {
    try {
      const data = await sleepHabitsService.getHabits();
      setHabits(data);
    } catch (error) {
      console.error('Failed to load sleep habits:', error);
    }
  };

  const handleStartTracking = async () => {
    try {
      await sleepTrackingService.startTracking();
      setIsTracking(true);
    } catch (error) {
      console.error('Failed to start tracking:', error);
    }
  };

  const handleStopTracking = async () => {
    try {
      const data = await sleepTrackingService.stopTracking();
      setSleepData(data);
      setIsTracking(false);
      setShowInsights(true);
    } catch (error) {
      console.error('Failed to stop tracking:', error);
    }
  };

  return (
    <Container>
      <ScrollView style={styles.container}>
        <Card style={styles.header}>
          <Text style={styles.title}>Sleep Tracking</Text>
          <Text style={styles.subtitle}>
            {isTracking ? 'Tracking your sleep...' : 'Ready to track your sleep'}
          </Text>
        </Card>

        <SleepTracking
          isTracking={isTracking}
          onStartTracking={handleStartTracking}
          onStopTracking={handleStopTracking}
        />

        {sleepData && habits && showInsights && (
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Sleep Insights</Text>
            <SleepInsights sleepData={sleepData} habits={habits} />
          </View>
        )}

        {sleepData && !showInsights && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Last Sleep Session</Text>
            <Text style={styles.summaryText}>
              Duration: {Math.round(sleepData.duration / 60)} minutes
            </Text>
            <Text style={styles.summaryText}>
              Quality Score: {sleepData.qualityScore}%
            </Text>
            <Button
              variant="primary"
              onPress={() => setShowInsights(true)}
              style={styles.viewInsightsButton}
            >
              View Detailed Insights
            </Button>
          </Card>
        )}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  insightsContainer: {
    marginTop: 16,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  summaryCard: {
    marginTop: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
  },
  viewInsightsButton: {
    marginTop: 16,
  },
}); 