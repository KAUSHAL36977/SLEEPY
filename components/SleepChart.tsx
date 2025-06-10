import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

interface SleepChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      color?: (opacity?: number) => string;
      strokeWidth?: number;
    }>;
  };
  title?: string;
}

const CHART_CONFIG = {
  backgroundColor: 'transparent',
  backgroundGradientFrom: 'rgba(26, 26, 46, 0.8)',
  backgroundGradientTo: 'rgba(22, 33, 62, 0.8)',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(167, 139, 250, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#a78bfa',
  },
};

export default function SleepChart({ data, title }: SleepChartProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <LineChart
        data={data}
        width={screenWidth - 68}
        height={220}
        chartConfig={CHART_CONFIG}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});