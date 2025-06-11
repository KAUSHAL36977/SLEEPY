import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SleepTracking } from '../../components/SleepTracking';
import { useTheme } from '../../context/ThemeContext';

export default function SleepTrackingScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SleepTracking />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 