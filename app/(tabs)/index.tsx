import React, { useState, useEffect, useCallback } from 'react';
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
  FadeIn,
  FadeOut,
  Layout,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const [selectedPeriod, setSelectedPeriod] = useState<number>(6);
  const [calculatedTimes, setCalculatedTimes] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  // Enhanced animations
  const sparkleAnim = useSharedValue(0);
  const moonAnim = useSharedValue(0);
  const fadeAnim = useSharedValue(0);
  const starsAnim = useSharedValue(0);
  const buttonPressAnim = useSharedValue(0);

  const insets = useSafeAreaInsets();

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

  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [
        {
          scale: interpolate(
            fadeAnim.value,
            [0, 1],
            [0.95, 1]
          ),
        },
      ],
    };
  });

  // Optimize animations with useCallback
  const handleModeChange = useCallback((mode: 'bedtime' | 'wakeup') => {
    setCalculatorMode(mode);
    setShowResults(false);
    setShowTooltip(false);
  }, []);

  const handlePeriodChange = useCallback((period: number) => {
    setSelectedPeriod(period);
    setShowResults(false);
  }, []);

  // Optimize results calculation
  const calculateTimes = useCallback(() => {
    const times: string[] = [];
    const baseTime = new Date(selectedTime);
    
    if (calculatorMode === 'bedtime') {
      // Calculate wake-up times
      for (let i = 1; i <= 6; i++) {
        const wakeTime = new Date(baseTime);
        wakeTime.setHours(wakeTime.getHours() - (i * 1.5));
        times.push(wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } else {
      // Calculate bedtimes
      for (let i = 1; i <= 6; i++) {
        const bedTime = new Date(baseTime);
        bedTime.setHours(bedTime.getHours() + (i * 1.5));
        times.push(bedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }
    
    setCalculatedTimes(times);
    fadeAnim.value = withTiming(1, { duration: 300 });
  }, [selectedTime, calculatorMode]);

  // Optimize time selection
  const handleTimeChange = useCallback((event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedTime(selectedDate);
      setShowResults(false);
    }
    setShowTimePicker(false);
  }, []);

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
    setSelectedPeriod(6);
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
                selectedPeriod === 6 && styles.periodOptionSelected
              ]}
              onPress={() => setSelectedPeriod(6)}
            >
              <Text style={[
                styles.periodOptionText,
                selectedPeriod === 6 && styles.periodOptionTextSelected
              ]}>
                AM
              </Text>
            </EnhancedTouchableOpacity>
            
            <EnhancedTouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === 12 && styles.periodOptionSelected
              ]}
              onPress={() => setSelectedPeriod(12)}
            >
              <Text style={[
                styles.periodOptionText,
                selectedPeriod === 12 && styles.periodOptionTextSelected
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
          
          {/* Mode Selection */}
          <Animated.View 
            style={[styles.modeContainer, fadeStyle]}
            entering={FadeIn.duration(300)}
          >
            <TouchableOpacity
              style={[
                styles.modeButton,
                calculatorMode === 'bedtime' && styles.modeButtonSelected
              ]}
              onPress={() => handleModeChange('bedtime')}
            >
              <Moon size={24} color={calculatorMode === 'bedtime' ? '#fff' : '#666'} />
              <Text style={[
                styles.modeText,
                calculatorMode === 'bedtime' && styles.modeTextSelected
              ]}>
                Bedtime
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                calculatorMode === 'wakeup' && styles.modeButtonSelected
              ]}
              onPress={() => handleModeChange('wakeup')}
            >
              <Sun size={24} color={calculatorMode === 'wakeup' ? '#fff' : '#666'} />
              <Text style={[
                styles.modeText,
                calculatorMode === 'wakeup' && styles.modeTextSelected
              ]}>
                Wake Up
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Time Selection */}
          <Animated.View 
            style={[styles.timeContainer, fadeStyle]}
            entering={FadeIn.duration(300).delay(100)}
          >
            <Text style={styles.timeLabel}>
              {calculatorMode === 'bedtime' ? 'When do you want to wake up?' : 'When do you want to go to bed?'}
            </Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={24} color="#fff" />
              <Text style={styles.timeText}>
                {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Period Selection */}
          <Animated.View 
            style={[styles.periodContainer, fadeStyle]}
            entering={FadeIn.duration(300).delay(200)}
          >
            <Text style={styles.periodLabel}>How many sleep cycles do you want?</Text>
            <View style={styles.periodOptions}>
              {[4, 5, 6].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodOption,
                    selectedPeriod === period && styles.periodOptionSelected
                  ]}
                  onPress={() => handlePeriodChange(period)}
                >
                  <Text style={[
                    styles.periodOptionText,
                    selectedPeriod === period && styles.periodOptionTextSelected
                  ]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <EnhancedTouchableOpacity
              style={styles.calculateButton}
              onPress={() => {
                buttonPressAnim.value = withSequence(
                  withTiming(1, { duration: 100 }),
                  withTiming(0, { duration: 100 })
                );
                calculateTimes();
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
              entering={SlideInRight.duration(400)}
              exiting={SlideOutLeft.duration(300)}
              layout={Layout.springify()}
            >
              <Text style={styles.resultsTitle}>
                {calculatorMode === 'bedtime' ? 'Wake Up Times' : 'Bedtime Options'}
              </Text>
              {calculatedTimes.map((time, index) => (
                <Animated.View 
                  key={index} 
                  style={styles.resultItem}
                  entering={FadeIn.duration(300).delay(index * 100)}
                >
                  <Clock size={20} color="#fff" />
                  <Text style={styles.resultText}>{time}</Text>
                </Animated.View>
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
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
              layout={Layout.springify()}
            >
              <Text style={styles.tooltipText}>
                Sleep cycles typically last 90 minutes. Waking up between cycles helps you feel more rested.
              </Text>
            </Animated.View>
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
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
  modeContainer: {
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
  modeButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  modeText: {
    color: '#888',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  modeTextSelected: {
    color: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 10,
  },
  timeLabel: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  periodLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  periodOptions: {
    flexDirection: 'row',
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
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  timeColumn: {
    alignItems: 'center',
    marginHorizontal: 10,
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
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
});