import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Activity, Heart, TrendingUp } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface HealthData {
  steps: number;
  heartRate: number;
  sleepHours: number;
  lastSync: Date;
}

export const HealthIntegration = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    heartRate: 0,
    sleepHours: 0,
    lastSync: new Date(),
  });
  const [isConnected, setIsConnected] = useState(false);

  const connectHealthApp = async () => {
    try {
      // TODO: Implement actual health app connection
      setIsConnected(true);
      // Simulate data fetch
      setHealthData({
        steps: 8432,
        heartRate: 72,
        sleepHours: 7.5,
        lastSync: new Date(),
      });
    } catch (error) {
      console.error('Failed to connect to health app:', error);
    }
  };

  const syncHealthData = async () => {
    try {
      // TODO: Implement actual data sync
      setHealthData(prev => ({
        ...prev,
        lastSync: new Date(),
      }));
    } catch (error) {
      console.error('Failed to sync health data:', error);
    }
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <Text style={styles.title}>Health & Fitness</Text>
      
      {!isConnected ? (
        <TouchableOpacity 
          style={styles.connectButton}
          onPress={connectHealthApp}
        >
          <Text style={styles.connectButtonText}>Connect Health App</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.dataContainer}>
          <View style={styles.dataRow}>
            <Activity size={24} color="#fff" />
            <View style={styles.dataTextContainer}>
              <Text style={styles.dataLabel}>Daily Steps</Text>
              <Text style={styles.dataValue}>{healthData.steps.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.dataRow}>
            <Heart size={24} color="#fff" />
            <View style={styles.dataTextContainer}>
              <Text style={styles.dataLabel}>Heart Rate</Text>
              <Text style={styles.dataValue}>{healthData.heartRate} BPM</Text>
            </View>
          </View>

          <View style={styles.dataRow}>
            <TrendingUp size={24} color="#fff" />
            <View style={styles.dataTextContainer}>
              <Text style={styles.dataLabel}>Sleep Hours</Text>
              <Text style={styles.dataValue}>{healthData.sleepHours} hours</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.syncButton}
            onPress={syncHealthData}
          >
            <Text style={styles.syncButtonText}>
              Last synced: {healthData.lastSync.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  connectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dataContainer: {
    gap: 15,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  dataTextContainer: {
    flex: 1,
  },
  dataLabel: {
    color: '#888',
    fontSize: 14,
  },
  dataValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  syncButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  syncButtonText: {
    color: '#888',
    fontSize: 12,
  },
}); 