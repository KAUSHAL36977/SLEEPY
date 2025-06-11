import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SleepAnalysisService } from '../services/SleepAnalysisService';
import { Card, StyledText } from './styled';
import { VictoryPie, VictoryLabel } from 'victory-native';

export const SleepAnalysisComponent: React.FC = () => {
  const { colors } = useTheme();
  const [patterns, setPatterns] = useState<any>(null);
  const [correlations, setCorrelations] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const analysisService = SleepAnalysisService.getInstance();

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    const sleepPatterns = await analysisService.analyzeSleepPatterns();
    const sleepCorrelations = await analysisService.findCorrelations();
    const personalizedRecs = await analysisService.generatePersonalizedRecommendations();

    setPatterns(sleepPatterns);
    setCorrelations(sleepCorrelations);
    setRecommendations(personalizedRecs);
  };

  if (!patterns) {
    return (
      <View style={styles.container}>
        <StyledText>Loading sleep analysis...</StyledText>
      </View>
    );
  }

  const qualityData = [
    { x: 'Quality', y: patterns.qualityScore },
    { x: 'Remaining', y: 100 - patterns.qualityScore },
  ];

  const efficiencyData = [
    { x: 'Efficiency', y: patterns.sleepEfficiency * 100 },
    { x: 'Remaining', y: 100 - patterns.sleepEfficiency * 100 },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Sleep Quality Overview */}
      <Card style={styles.section}>
        <StyledText variant="h2">Sleep Quality Overview</StyledText>
        <View style={styles.chartContainer}>
          <VictoryPie
            data={qualityData}
            colorScale={[colors.primary, colors.background]}
            width={200}
            height={200}
            innerRadius={70}
            labelRadius={({ innerRadius }) => (innerRadius as number) + 20}
            style={{ labels: { fill: colors.text.primary } }}
            labelComponent={
              <VictoryLabel
                text={({ datum }) => `${datum.x}: ${Math.round(datum.y)}%`}
                style={{ fill: colors.text.primary }}
              />
            }
          />
        </View>
      </Card>

      {/* Sleep Efficiency */}
      <Card style={styles.section}>
        <StyledText variant="h2">Sleep Efficiency</StyledText>
        <View style={styles.chartContainer}>
          <VictoryPie
            data={efficiencyData}
            colorScale={[colors.secondary, colors.background]}
            width={200}
            height={200}
            innerRadius={70}
            labelRadius={({ innerRadius }) => (innerRadius as number) + 20}
            style={{ labels: { fill: colors.text.primary } }}
            labelComponent={
              <VictoryLabel
                text={({ datum }) => `${datum.x}: ${Math.round(datum.y)}%`}
                style={{ fill: colors.text.primary }}
              />
            }
          />
        </View>
      </Card>

      {/* Sleep Metrics */}
      <Card style={styles.section}>
        <StyledText variant="h2">Sleep Metrics</StyledText>
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <StyledText>Average Duration</StyledText>
            <StyledText>{patterns.averageSleepDuration.toFixed(1)} hours</StyledText>
          </View>
          <View style={styles.metricItem}>
            <StyledText>Consistency Score</StyledText>
            <StyledText>{Math.round(patterns.consistencyScore)}%</StyledText>
          </View>
          <View style={styles.metricItem}>
            <StyledText>Recovery Score</StyledText>
            <StyledText>{Math.round(patterns.recoveryScore)}%</StyledText>
          </View>
          <View style={styles.metricItem}>
            <StyledText>Disturbances</StyledText>
            <StyledText>{patterns.disturbances}/10</StyledText>
          </View>
        </View>
      </Card>

      {/* Impact Factors */}
      <Card style={styles.section}>
        <StyledText variant="h2">Impact Factors</StyledText>
        {correlations.map((correlation, index) => (
          <View key={index} style={styles.correlationItem}>
            <StyledText>{correlation.factor}</StyledText>
            <View style={styles.impactBar}>
              <View
                style={[
                  styles.impactFill,
                  {
                    width: `${correlation.impact * 100}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
            <StyledText>Confidence: {Math.round(correlation.confidence * 100)}%</StyledText>
          </View>
        ))}
      </Card>

      {/* Personalized Recommendations */}
      <Card style={styles.section}>
        <StyledText variant="h2">Recommendations</StyledText>
        {recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <StyledText variant="h3">{recommendation.title}</StyledText>
            <StyledText>{recommendation.description}</StyledText>
            <View style={styles.evidenceContainer}>
              {recommendation.evidence.map((evidence: string, idx: number) => (
                <View key={idx} style={styles.evidenceItem}>
                  <StyledText>• {evidence}</StyledText>
                </View>
              ))}
            </View>
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
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  metricsContainer: {
    marginVertical: 16,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  correlationItem: {
    marginVertical: 8,
  },
  impactBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 4,
  },
  impactFill: {
    height: '100%',
    borderRadius: 4,
  },
  recommendationItem: {
    marginVertical: 12,
  },
  evidenceContainer: {
    marginTop: 8,
    marginLeft: 16,
  },
  evidenceItem: {
    marginVertical: 4,
  },
}); 