import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { VictoryPie } from 'victory-native';
import { useTheme } from '../context/ThemeContext';
import { SleepData, SleepPhase } from '../services/SleepTrackingService';
import { Card, StyledText } from './styled';

interface SleepVisualizationProps {
  sleepData: SleepData;
}

export const SleepVisualization: React.FC<SleepVisualizationProps> = ({ sleepData }) => {
  const { colors } = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  const calculatePhaseDurations = () => {
    const durations = {
      light: 0,
      deep: 0,
      rem: 0,
      awake: 0,
    };

    sleepData.sleepPhases.forEach(phase => {
      const duration = phase.endTime.getTime() - phase.startTime.getTime();
      durations[phase.type] += duration;
    });

    return durations;
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const phaseDurations = calculatePhaseDurations();
  const totalDuration = Object.values(phaseDurations).reduce((a, b) => a + b, 0);

  const pieData = Object.entries(phaseDurations).map(([type, duration]) => ({
    x: type,
    y: (duration / totalDuration) * 100,
    label: `${type}\n${formatDuration(duration)}`,
  }));

  const getPhaseColor = (type: string) => {
    switch (type) {
      case 'deep':
        return colors.sleep.deep;
      case 'light':
        return colors.sleep.light;
      case 'rem':
        return colors.sleep.rem;
      case 'awake':
        return colors.sleep.awake;
      default:
        return colors.primary.main;
    }
  };

  return (
    <Card style={styles.container}>
      <StyledText variant="h2" style={styles.title}>Sleep Analysis</StyledText>

      {/* Sleep Quality Score */}
      <View style={styles.scoreContainer}>
        <StyledText variant="h3">Sleep Quality Score</StyledText>
        <StyledText variant="h1" style={styles.score}>
          {Math.round(sleepData.qualityScore)}/100
        </StyledText>
      </View>

      {/* Sleep Phase Distribution */}
      <View style={styles.chartContainer}>
        <StyledText variant="h3" style={styles.chartTitle}>Sleep Phase Distribution</StyledText>
        <VictoryPie
          data={pieData}
          colorScale={pieData.map(d => getPhaseColor(d.x))}
          width={screenWidth - 80}
          height={300}
          innerRadius={70}
          labelRadius={({ innerRadius }: { innerRadius: number }) => innerRadius + 40}
          style={{
            labels: {
              fill: colors.text,
              fontSize: 12,
              fontWeight: 'bold',
            },
          }}
        />
      </View>

      {/* Sleep Duration */}
      <View style={styles.durationContainer}>
        <StyledText variant="h3">Total Sleep Duration</StyledText>
        <StyledText variant="h2">
          {formatDuration(totalDuration)}
        </StyledText>
      </View>

      {/* Snore Events */}
      {sleepData.snoreEvents.length > 0 && (
        <View style={styles.snoreContainer}>
          <StyledText variant="h3">Snore Events</StyledText>
          <StyledText>
            {sleepData.snoreEvents.length} events detected
          </StyledText>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    marginBottom: 16,
  },
  durationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  snoreContainer: {
    alignItems: 'center',
  },
}); 