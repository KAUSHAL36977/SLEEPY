import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Card, Text, useTheme } from '../components/styled';
import { AISleepAnalysisService } from '../services/AISleepAnalysisService';
import { SleepData, SleepHabits } from '../types/sleep';
import { VictoryPie, VictoryChart, VictoryBar, VictoryTheme } from 'victory-native';
import { COLORS } from '../constants/theme';

interface SleepInsightsProps {
  sleepData: SleepData;
  habits: SleepHabits;
}

export const SleepInsights: React.FC<SleepInsightsProps> = ({ sleepData, habits }) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const aiService = new AISleepAnalysisService();

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const analysis = await aiService.analyzeSleepData(sleepData, habits);
        setInsights(analysis);
      } catch (error) {
        console.error('Failed to load sleep insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [sleepData, habits]);

  if (loading) {
    return (
      <Card style={styles.container}>
        <Text>Loading insights...</Text>
      </Card>
    );
  }

  const renderInsightCard = (insight: any) => (
    <Card key={insight.type} style={styles.insightCard}>
      <Text style={styles.insightTitle}>{insight.title}</Text>
      <Text style={styles.insightDescription}>{insight.description}</Text>
      
      <View style={styles.severityContainer}>
        <Text style={styles.severityLabel}>Severity:</Text>
        <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(insight.severity) }]} />
      </View>

      <View style={styles.impactContainer}>
        <Text style={styles.impactLabel}>Impact:</Text>
        <View style={styles.impactBar}>
          <View 
            style={[
              styles.impactFill, 
              { 
                width: `${insight.impact}%`,
                backgroundColor: getImpactColor(insight.impact)
              }
            ]} 
          />
        </View>
      </View>

      <Text style={styles.recommendationsTitle}>Recommendations:</Text>
      {insight.recommendations.map((rec: string, index: number) => (
        <Text key={index} style={styles.recommendation}>• {rec}</Text>
      ))}
    </Card>
  );

  const renderSleepPhaseChart = () => {
    const phaseData = sleepData.phases.map(phase => ({
      x: phase.type,
      y: phase.duration,
      label: `${phase.type}\n${Math.round(phase.duration / 60)}m`
    }));

    return (
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Sleep Phases</Text>
        <VictoryPie
          data={phaseData}
          colorScale={[COLORS.sleep.light, COLORS.sleep.deep, COLORS.sleep.rem, COLORS.sleep.awake]}
          innerRadius={70}
          labelRadius={({ innerRadius }) => (innerRadius as number) + 40}
          style={{ labels: { fill: theme.colors.text, fontSize: 12, fontWeight: 'bold' } }}
        />
      </Card>
    );
  };

  const renderQualityChart = () => {
    const qualityData = [
      { x: 'Quality', y: sleepData.qualityScore },
      { x: 'Deep Sleep', y: calculateDeepSleepPercentage(sleepData.phases) }
    ];

    return (
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Sleep Quality Metrics</Text>
        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
          <VictoryBar
            data={qualityData}
            style={{
              data: {
                fill: ({ datum }) => datum.y > 70 ? COLORS.status.success : COLORS.status.warning
              }
            }}
            labels={({ datum }) => `${datum.y}%`}
          />
        </VictoryChart>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderSleepPhaseChart()}
      {renderQualityChart()}
      {insights.map(renderInsightCard)}
    </ScrollView>
  );
};

const calculateDeepSleepPercentage = (phases: any[]) => {
  const deepSleepDuration = phases
    .filter(phase => phase.type === 'deep')
    .reduce((total, phase) => total + phase.duration, 0);
  
  const totalSleepDuration = phases.reduce((total, phase) => total + phase.duration, 0);
  return Math.round((deepSleepDuration / totalSleepDuration) * 100);
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return COLORS.status.error;
    case 'medium':
      return COLORS.status.warning;
    case 'low':
      return COLORS.status.success;
    default:
      return COLORS.status.info;
  }
};

const getImpactColor = (impact: number) => {
  if (impact > 70) return COLORS.status.error;
  if (impact > 40) return COLORS.status.warning;
  return COLORS.status.success;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  insightCard: {
    marginBottom: 16,
    padding: 16,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  impactContainer: {
    marginBottom: 16,
  },
  impactLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  impactBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  impactFill: {
    height: '100%',
    borderRadius: 4,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendation: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 8,
  },
  chartCard: {
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 