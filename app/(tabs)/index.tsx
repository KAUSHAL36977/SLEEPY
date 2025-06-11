import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Moon, 
  Sun, 
  Clock, 
  Sparkles,
  RotateCcw,
  Calculator,
  Info,
  Star
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
  withSequence,
  Easing,
  FadeIn
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced TouchableOpacity with ripple effect
const EnhancedTouchableOpacity = ({ children, style, onPress, ...props }: any) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const SLEEP_CYCLE_DURATION = 90; // minutes

export default function SleepCycleCalculator() {
  const [calculatorMode, setCalculatorMode] = useState<'bedtime' | 'wakeup'>('bedtime');
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [selectedPeriod, setSelectedPeriod] = useState<'PM' | 'AM'>('PM');
  const [calculatedTimes, setCalculatedTimes] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Enhanced animations
  const sparkleAnim = useSharedValue(0);
  const moonAnim = useSharedValue(0);
  const fadeAnim = useSharedValue(0);
  const starsAnim = useSharedValue(0);
  const buttonPressAnim = useSharedValue(0);

  useEffect(() => {
    // Load last used time
    loadLastUsedTime();
    
    // Enhanced animations
    sparkleAnim.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );

    moonAnim.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
    );

    starsAnim.value = withRepeat(
      withTiming(1, { duration: 5000 }),
      -1,
      true
    );

    fadeAnim.value = withSpring(1, { duration: 1000 });
  }, []);

  const loadLastUsedTime = async () => {
    try {
      const savedTime = await AsyncStorage.getItem('lastUsedTime');
      if (savedTime) {
        const { hour, minute, period } = JSON.parse(savedTime);
        setSelectedHour(hour);
        setSelectedMinute(minute);
        setSelectedPeriod(period);
      }
    } catch (error) {
      console.error('Error loading last used time:', error);
    }
  };

  const saveLastUsedTime = async () => {
    try {
      await AsyncStorage.setItem('lastUsedTime', JSON.stringify({
        hour: selectedHour,
        minute: selectedMinute,
        period: selectedPeriod
      }));
    } catch (error) {
      console.error('Error saving last used time:', error);
    }
  };

  // Enhanced animation styles
  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sparkleAnim.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(sparkleAnim.value, [0, 1], [0.8, 1.2]) }],
  }));

  const moonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(moonAnim.value, [0, 1], [-5, 5]) },
      { rotate: `${interpolate(moonAnim.value, [0, 1], [-2, 2])}deg` }
    ],
  }));

  const starsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(starsAnim.value, [0, 1], [0.2, 0.8]),
    transform: [
      { translateY: interpolate(starsAnim.value, [0, 1], [-2, 2]) },
      { scale: interpolate(starsAnim.value, [0, 1], [0.9, 1.1]) }
    ],
  }));

  const buttonPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(buttonPressAnim.value, [0, 1], [1, 0.95]) }],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: interpolate(fadeAnim.value, [0, 1], [20, 0]) }],
  }));

  const calculateOptimalTimes = () => {
    const now = new Date();
    let targetTime: Date;

    if (calculatorMode === 'bedtime') {
      // Calculate wake times based on bedtime
      targetTime = new Date();
      targetTime.setHours(
        selectedPeriod === 'AM' ? selectedHour : selectedHour + 12,
        selectedMinute,
        0,
        0
      );
      
      // If bedtime is tomorrow (late night)
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const times: string[] = [];
      // Calculate 4-6 sleep cycles (6-9 hours)
      for (let cycles = 4; cycles <= 6; cycles++) {
        const wakeTime = new Date(targetTime.getTime() + cycles * SLEEP_CYCLE_DURATION * 60000);
        times.push(formatTime(wakeTime));
      }
      setCalculatedTimes(times);
    } else {
      // Calculate bedtimes based on wake time
      targetTime = new Date();
      targetTime.setHours(
        selectedPeriod === 'AM' ? selectedHour : selectedHour + 12,
        selectedMinute,
        0,
        0
      );

      // If wake time is today but in the past, assume tomorrow
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const times: string[] = [];
      // Calculate 4-6 sleep cycles (6-9 hours) backwards
      for (let cycles = 6; cycles >= 4; cycles--) {
        const bedTime = new Date(targetTime.getTime() - cycles * SLEEP_CYCLE_DURATION * 60000);
        times.push(formatTime(bedTime));
      }
      setCalculatedTimes(times);
    }

    setShowResults(true);
  };

  const sleepNow = () => {
    const now = new Date();
    const times: string[] = [];
    
    // Calculate wake times starting from now
    for (let cycles = 4; cycles <= 6; cycles++) {
      const wakeTime = new Date(now.getTime() + cycles * SLEEP_CYCLE_DURATION * 60000);
      times.push(formatTime(wakeTime));
    }
    
    setCalculatedTimes(times);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setShowResults(false);
    setCalculatedTimes([]);
    setSelectedHour(10);
    setSelectedMinute(30);
    setSelectedPeriod('PM');
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const renderTimePicker = () => (
    <View style={styles.timePickerContainer}>
      <View style={styles.timePicker}>
        {/* Hour Picker */}
        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>Hour</Text>
          <ScrollView 
            style={styles.timeScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.timeScrollContent}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
              <EnhancedTouchableOpacity
                key={hour}
                style={[
                  styles.timeOption,
                  selectedHour === hour && styles.timeOptionSelected
                ]}
                onPress={() => setSelectedHour(hour)}
              >
                <Text style={[
                  styles.timeOptionText,
                  selectedHour === hour && styles.timeOptionTextSelected
                ]}>
                  {hour}
                </Text>
              </EnhancedTouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Minute Picker */}
        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>Min</Text>
          <ScrollView 
            style={styles.timeScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.timeScrollContent}
          >
            {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
              <EnhancedTouchableOpacity
                key={minute}
                style={[
                  styles.timeOption,
                  selectedMinute === minute && styles.timeOptionSelected
                ]}
                onPress={() => setSelectedMinute(minute)}
              >
                <Text style={[
                  styles.timeOptionText,
                  selectedMinute === minute && styles.timeOptionTextSelected
                ]}>
                  {minute.toString().padStart(2, '0')}
                </Text>
              </EnhancedTouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AM/PM Picker */}
        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>Period</Text>
          <View style={styles.periodContainer}>
            <EnhancedTouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === 'AM' && styles.periodOptionSelected
              ]}
              onPress={() => setSelectedPeriod('AM')}
            >
              <Text style={[
                styles.periodOptionText,
                selectedPeriod === 'AM' && styles.periodOptionTextSelected
              ]}>
                AM
              </Text>
            </EnhancedTouchableOpacity>
            
            <EnhancedTouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === 'PM' && styles.periodOptionSelected
              ]}
              onPress={() => setSelectedPeriod('PM')}
            >
              <Text style={[
                styles.periodOptionText,
                selectedPeriod === 'PM' && styles.periodOptionTextSelected
              ]}>
                PM
              </Text>
            </EnhancedTouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      {/* Animated Background Elements */}
      <Animated.View style={[styles.starsContainer, starsStyle]}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Star
            key={i}
            size={Math.random() * 3 + 1}
            color="#ffffff"
            style={[
              styles.star,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              },
            ]}
          />
        ))}
      </Animated.View>

      <Animated.View style={[styles.moonContainer, moonStyle]}>
        <Moon size={100} color="#f0f0f0" />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, fadeStyle]}>
          <Text style={styles.title}>Sleep Cycle Calculator</Text>
          
          {/* Mode Selector */}
          <View style={styles.modeSelector}>
            <EnhancedTouchableOpacity
              style={[
                styles.modeButton,
                calculatorMode === 'bedtime' && styles.modeButtonActive
              ]}
              onPress={() => setCalculatorMode('bedtime')}
            >
              <Moon size={24} color={calculatorMode === 'bedtime' ? '#fff' : '#888'} />
              <Text style={[
                styles.modeButtonText,
                calculatorMode === 'bedtime' && styles.modeButtonTextActive
              ]}>Bedtime</Text>
            </EnhancedTouchableOpacity>

            <EnhancedTouchableOpacity
              style={[
                styles.modeButton,
                calculatorMode === 'wakeup' && styles.modeButtonActive
              ]}
              onPress={() => setCalculatorMode('wakeup')}
            >
              <Sun size={24} color={calculatorMode === 'wakeup' ? '#fff' : '#888'} />
              <Text style={[
                styles.modeButtonText,
                calculatorMode === 'wakeup' && styles.modeButtonTextActive
              ]}>Wake Up</Text>
            </EnhancedTouchableOpacity>
          </View>

          {/* Time Picker with Enhanced UI */}
          <BlurView intensity={20} style={styles.timePickerBlur}>
            {renderTimePicker()}
          </BlurView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <EnhancedTouchableOpacity
              style={styles.calculateButton}
              onPress={() => {
                buttonPressAnim.value = withSequence(
                  withTiming(1, { duration: 100 }),
                  withTiming(0, { duration: 100 })
                );
                calculateOptimalTimes();
                saveLastUsedTime();
              }}
            >
              <Calculator size={24} color="#fff" />
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </EnhancedTouchableOpacity>

            <EnhancedTouchableOpacity
              style={styles.sleepNowButton}
              onPress={() => {
                buttonPressAnim.value = withSequence(
                  withTiming(1, { duration: 100 }),
                  withTiming(0, { duration: 100 })
                );
                sleepNow();
              }}
            >
              <Moon size={24} color="#fff" />
              <Text style={styles.sleepNowButtonText}>Sleep Now</Text>
            </EnhancedTouchableOpacity>
          </View>

          {/* Results Section */}
          {showResults && (
            <Animated.View 
              style={[styles.resultsContainer, fadeStyle]}
              entering={FadeIn}
            >
              <Text style={styles.resultsTitle}>
                {calculatorMode === 'bedtime' ? 'Wake Up Times' : 'Bedtime Options'}
              </Text>
              {calculatedTimes.map((time, index) => (
                <View key={index} style={styles.resultItem}>
                  <Clock size={20} color="#fff" />
                  <Text style={styles.resultText}>{time}</Text>
                </View>
              ))}
            </Animated.View>
          )}

          {/* Info Tooltip */}
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowTooltip(!showTooltip)}
          >
            <Info size={24} color="#fff" />
          </TouchableOpacity>
          
          {showTooltip && (
            <Animated.View 
              style={[styles.tooltip, fadeStyle]}
              entering={FadeIn}
            >
              <Text style={styles.tooltipText}>
                Sleep cycles typically last 90 minutes. Waking up between cycles helps you feel more rested.
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 5,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  modeButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  modeButtonText: {
    color: '#888',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  timePickerBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  timeColumn: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timeLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  timeScroll: {
    height: 150,
  },
  timeScrollContent: {
    alignItems: 'center',
  },
  timeOption: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeOptionText: {
    color: '#888',
    fontSize: 18,
  },
  timeOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 15,
    marginRight: 10,
    minWidth: 150,
    justifyContent: 'center',
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sleepNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9b59b6',
    padding: 15,
    borderRadius: 15,
    minWidth: 150,
    justifyContent: 'center',
  },
  sleepNowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 20,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  infoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 25,
  },
  tooltip: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    maxWidth: 250,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
  },
  moonContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    opacity: 0.3,
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  periodOption: {
    padding: 10,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodOptionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  periodOptionText: {
    color: '#888',
    fontSize: 16,
  },
  periodOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});