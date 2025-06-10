import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Moon, 
  Sun, 
  Clock, 
  Sparkles,
  RotateCcw,
  Calculator,
  Info
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withTiming,
  interpolate
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Web-compatible TouchableOpacity wrapper
const WebCompatibleTouchableOpacity = ({ children, style, onPress, ...props }: any) => {
  if (Platform.OS === 'web') {
    const { 
      onResponderTerminate, 
      onResponderTerminationRequest, 
      ...webSafeProps 
    } = props;
    
    return (
      <TouchableOpacity 
        style={style} 
        onPress={onPress} 
        {...webSafeProps}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity style={style} onPress={onPress} {...props}>
      {children}
    </TouchableOpacity>
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

  // Animations
  const sparkleAnim = useSharedValue(0);
  const moonAnim = useSharedValue(0);
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    // Gentle sparkle animation
    sparkleAnim.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );

    // Floating moon animation
    moonAnim.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
    );

    // Fade in animation
    fadeAnim.value = withSpring(1, { duration: 1000 });
  }, []);

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
              <WebCompatibleTouchableOpacity
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
              </WebCompatibleTouchableOpacity>
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
              <WebCompatibleTouchableOpacity
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
              </WebCompatibleTouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AM/PM Picker */}
        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>Period</Text>
          <View style={styles.periodContainer}>
            <WebCompatibleTouchableOpacity
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
            </WebCompatibleTouchableOpacity>
            
            <WebCompatibleTouchableOpacity
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
            </WebCompatibleTouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#0a0a1a', '#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      {/* Animated Background Elements */}
      <Animated.View style={[styles.backgroundMoon, moonStyle]}>
        <Moon color="rgba(167, 139, 250, 0.1)" size={120} />
      </Animated.View>
      
      <Animated.View style={[styles.sparkle1, sparkleStyle]}>
        <Sparkles color="rgba(251, 191, 36, 0.3)" size={16} />
      </Animated.View>
      
      <Animated.View style={[styles.sparkle2, sparkleStyle]}>
        <Sparkles color="rgba(167, 139, 250, 0.4)" size={12} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View style={[styles.header, fadeStyle]}>
          <View style={styles.titleContainer}>
            <Calculator color="#a78bfa" size={28} />
            <Text style={styles.title}>Sleep Cycle Calculator</Text>
          </View>
          
          <Text style={styles.expertText}>
            Expert Verified By: Chaunie Brusie, RN, BSN
          </Text>
          
          <Text style={styles.description}>
            It's important to wake up after a completed sleep cycle — rather than mid-cycle — to feel refreshed and improve your sleep quality. Simply choose your bedtime or wake-up time below and hit Calculate.
          </Text>
        </Animated.View>

        {/* Mode Toggle */}
        <Animated.View style={[styles.modeToggle, fadeStyle]}>
          <WebCompatibleTouchableOpacity
            style={[
              styles.modeButton,
              styles.modeButtonLeft,
              calculatorMode === 'bedtime' && styles.modeButtonActive
            ]}
            onPress={() => setCalculatorMode('bedtime')}
          >
            <Moon 
              color={calculatorMode === 'bedtime' ? '#1a1a2e' : '#9ca3af'} 
              size={16} 
            />
            <Text style={[
              styles.modeButtonText,
              calculatorMode === 'bedtime' && styles.modeButtonTextActive
            ]}>
              I want to go to bed at...
            </Text>
          </WebCompatibleTouchableOpacity>
          
          <WebCompatibleTouchableOpacity
            style={[
              styles.modeButton,
              styles.modeButtonRight,
              calculatorMode === 'wakeup' && styles.modeButtonActive
            ]}
            onPress={() => setCalculatorMode('wakeup')}
          >
            <Sun 
              color={calculatorMode === 'wakeup' ? '#1a1a2e' : '#9ca3af'} 
              size={16} 
            />
            <Text style={[
              styles.modeButtonText,
              calculatorMode === 'wakeup' && styles.modeButtonTextActive
            ]}>
              I want to wake up at...
            </Text>
          </WebCompatibleTouchableOpacity>
        </Animated.View>

        {/* Time Picker */}
        {!showResults && (
          <Animated.View style={[styles.inputSection, fadeStyle]}>
            {renderTimePicker()}
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View style={[styles.actionButtons, fadeStyle]}>
          {!showResults ? (
            <>
              <WebCompatibleTouchableOpacity 
                style={styles.primaryButton}
                onPress={calculateOptimalTimes}
              >
                <Calculator color="#1a1a2e" size={20} />
                <Text style={styles.primaryButtonText}>CALCULATE</Text>
              </WebCompatibleTouchableOpacity>
              
              <WebCompatibleTouchableOpacity 
                style={styles.secondaryButton}
                onPress={sleepNow}
              >
                <Clock color="#a78bfa" size={20} />
                <Text style={styles.secondaryButtonText}>SLEEP NOW</Text>
              </WebCompatibleTouchableOpacity>
            </>
          ) : (
            <WebCompatibleTouchableOpacity 
              style={styles.resetButton}
              onPress={resetCalculator}
            >
              <RotateCcw color="#a78bfa" size={20} />
              <Text style={styles.resetButtonText}>CHECK AGAIN</Text>
            </WebCompatibleTouchableOpacity>
          )}
        </Animated.View>

        {/* Results Section */}
        {showResults && (
          <Animated.View style={[styles.resultsSection, fadeStyle]}>
            <LinearGradient
              colors={['rgba(167, 139, 250, 0.15)', 'rgba(139, 92, 246, 0.05)']}
              style={styles.resultsCard}
            >
              <View style={styles.resultsHeader}>
                <Sparkles color="#a78bfa" size={24} />
                <Text style={styles.resultsTitle}>
                  {calculatorMode === 'bedtime' 
                    ? 'To wake up refreshed, you should aim to wake up at...'
                    : 'To wake up refreshed, you should aim to sleep at...'
                  }
                </Text>
              </View>
              
              <View style={styles.timeResults}>
                {calculatedTimes.map((time, index) => (
                  <View key={index} style={styles.timeResultItem}>
                    <View style={styles.cycleInfo}>
                      <Text style={styles.cycleNumber}>{index + 4}</Text>
                      <Text style={styles.cycleLabel}>cycles</Text>
                    </View>
                    <Text style={styles.resultTime}>{time}</Text>
                    <Text style={styles.resultDuration}>
                      {((index + 4) * 1.5).toFixed(1)}h sleep
                    </Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.recommendationBadge}>
                <Text style={styles.recommendationText}>
                  💤 Most refreshing: {calculatedTimes[1] || calculatedTimes[0]}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Footer */}
        <Animated.View style={[styles.footer, fadeStyle]}>
          <View style={styles.footerContent}>
            <Info color="#6b7280" size={16} />
            <Text style={styles.footerText}>
              Powered by Sleep Cycle Logic – Sleepopolis Certified
            </Text>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacer} />
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
    paddingBottom: 40,
  },
  backgroundMoon: {
    position: 'absolute',
    top: 80,
    right: -20,
    opacity: 0.1,
    zIndex: 0,
  },
  sparkle1: {
    position: 'absolute',
    top: 150,
    left: 30,
    zIndex: 0,
  },
  sparkle2: {
    position: 'absolute',
    top: 200,
    right: 80,
    zIndex: 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    zIndex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  expertText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
    lineHeight: 24,
  },
  modeToggle: {
    marginHorizontal: 24,
    marginBottom: 32,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  modeButtonLeft: {
    marginRight: 2,
  },
  modeButtonRight: {
    marginLeft: 2,
  },
  modeButtonActive: {
    backgroundColor: '#a78bfa',
  },
  modeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
    textAlign: 'center',
  },
  modeButtonTextActive: {
    color: '#1a1a2e',
  },
  inputSection: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  timePickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  timeScroll: {
    maxHeight: 120,
    width: '100%',
  },
  timeScrollContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: 'rgba(167, 139, 250, 0.3)',
  },
  timeOptionText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#d1d5db',
  },
  timeOptionTextSelected: {
    color: '#a78bfa',
    fontFamily: 'Inter-Bold',
  },
  periodContainer: {
    gap: 8,
  },
  periodOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  periodOptionSelected: {
    backgroundColor: 'rgba(167, 139, 250, 0.3)',
  },
  periodOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#d1d5db',
  },
  periodOptionTextSelected: {
    color: '#a78bfa',
    fontFamily: 'Inter-Bold',
  },
  actionButtons: {
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a78bfa',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1a1a2e',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(167, 139, 250, 0.4)',
    gap: 12,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#a78bfa',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    gap: 12,
  },
  resetButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#a78bfa',
  },
  resultsSection: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  resultsCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  resultsTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    lineHeight: 24,
  },
  timeResults: {
    gap: 16,
    marginBottom: 24,
  },
  timeResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cycleInfo: {
    alignItems: 'center',
    marginRight: 16,
  },
  cycleNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#a78bfa',
  },
  cycleLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  resultTime: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  resultDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  recommendationBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  recommendationText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fbbf24',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});