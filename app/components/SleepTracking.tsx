import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SleepData, SleepTrackingService } from '../services/SleepTrackingService';
import { SleepVisualization } from './SleepVisualization';
import { Button, Card, StyledText } from './styled';

export const SleepTracking: React.FC = () => {
  const { colors } = useTheme();
  const [isTracking, setIsTracking] = useState(false);
  const [sleepData, setSleepData] = useState<SleepData | null>(null);
  const [trackingService] = useState(() => new SleepTrackingService());

  useEffect(() => {
    return () => {
      if (isTracking) {
        trackingService.stopTracking();
      }
    };
  }, [isTracking, trackingService]);

  const handleStartTracking = async () => {
    try {
      await trackingService.startTracking();
      setIsTracking(true);
      Alert.alert('Sleep Tracking Started', 'Your sleep session is now being tracked.');
    } catch (error) {
      Alert.alert('Error', 'Failed to start sleep tracking. Please check permissions and try again.');
    }
  };

  const handleStopTracking = async () => {
    try {
      const data = await trackingService.stopTracking();
      setIsTracking(false);
      setSleepData(data);
      Alert.alert('Sleep Tracking Complete', 'Your sleep data has been saved.');
    } catch (error) {
      Alert.alert('Error', 'Failed to stop sleep tracking. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.controlCard}>
        <StyledText variant="h2" style={styles.title}>
          Sleep Tracking
        </StyledText>
        
        {!isTracking && !sleepData && (
          <Button
            variant="primary"
            size="large"
            onPress={handleStartTracking}
            style={styles.button}
          >
            Start Sleep Tracking
          </Button>
        )}

        {isTracking && (
          <Button
            variant="secondary"
            size="large"
            onPress={handleStopTracking}
            style={styles.button}
          >
            Stop Tracking
          </Button>
        )}

        {sleepData && (
          <SleepVisualization sleepData={sleepData} />
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  controlCard: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginVertical: 16,
  },
}); 