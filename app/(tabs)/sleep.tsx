import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  FlatList 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Moon, 
  Play, 
  Pause, 
  Volume2, 
  Timer,
  Waves,
  TreePine,
  CloudRain,
  Wind,
  Headphones
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { Circle } from 'react-native-progress';

const { width: screenWidth } = Dimensions.get('window');

const SLEEP_SOUNDS = [
  { id: 1, name: 'Ocean Waves', icon: Waves, color: '#3b82f6', duration: '30 min' },
  { id: 2, name: 'Forest Rain', icon: CloudRain, color: '#10b981', duration: '45 min' },
  { id: 3, name: 'Wind Chimes', icon: Wind, color: '#8b5cf6', duration: '60 min' },
  { id: 4, name: 'Pine Forest', icon: TreePine, color: '#059669', duration: '35 min' },
  { id: 5, name: 'White Noise', icon: Volume2, color: '#6b7280', duration: '∞' },
  { id: 6, name: 'Binaural Beats', icon: Headphones, color: '#f59e0b', duration: '40 min' },
];

export default function SleepScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSound, setCurrentSound] = useState<number | null>(null);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [selectedTimer, setSelectedTimer] = useState(30);

  const pulseAnim = useSharedValue(1);
  const waveAnim = useSharedValue(0);

  useEffect(() => {
    if (isTracking) {
      // Start tracking animations
      pulseAnim.value = withRepeat(
        withSpring(1.2, { duration: 2000 }),
        -1,
        true
      );
      
      waveAnim.value = withRepeat(
        withTiming(1, { duration: 3000 }),
        -1,
        false
      );
    } else {
      pulseAnim.value = withSpring(1);
      waveAnim.value = withTiming(0);
    }
  }, [isTracking]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    opacity: 0.6 - (waveAnim.value * 0.4),
    transform: [{ scale: 1 + (waveAnim.value * 0.5) }],
  }));

  const toggleSleepTracking = () => {
    setIsTracking(!isTracking);
  };

  const playSound = (soundId: number) => {
    setCurrentSound(currentSound === soundId ? null : soundId);
  };

  const renderSoundItem = ({ item }: { item: typeof SLEEP_SOUNDS[0] }) => {
    const IconComponent = item.icon;
    const isPlaying = currentSound === item.id;
    
    return (
      <TouchableOpacity 
        style={[styles.soundCard, isPlaying && styles.soundCardActive]}
        onPress={() => playSound(item.id)}
      >
        <View style={[styles.soundIcon, { backgroundColor: item.color + '20' }]}>
          <IconComponent color={item.color} size={24} />
        </View>
        
        <View style={styles.soundInfo}>
          <Text style={styles.soundName}>{item.name}</Text>
          <Text style={styles.soundDuration}>{item.duration}</Text>
        </View>
        
        <TouchableOpacity style={styles.playButton}>
          {isPlaying ? (
            <Pause color="#a78bfa\" size={20} />
          ) : (
            <Play color="#a78bfa" size={20} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sleep Tracker</Text>
          <Text style={styles.subtitle}>Track your sleep and relax with sounds</Text>
        </View>

        {/* Sleep Tracking */}
        <View style={styles.trackingCard}>
          <LinearGradient
            colors={['rgba(167, 139, 250, 0.2)', 'rgba(139, 92, 246, 0.1)']}
            style={styles.cardGradient}
          >
            <Text style={styles.cardTitle}>Sleep Tracking</Text>
            
            <View style={styles.trackingCenter}>
              <Animated.View style={[styles.trackingRipple1, waveStyle]} />
              <Animated.View style={[styles.trackingRipple2, waveStyle]} />
              
              <Animated.View style={[styles.trackingButton, pulseStyle]}>
                <TouchableOpacity
                  style={[styles.trackingInner, isTracking && styles.trackingActive]}
                  onPress={toggleSleepTracking}
                >
                  <Moon 
                    color={isTracking ? "#1a1a2e" : "#a78bfa"} 
                    size={40} 
                    fill={isTracking ? "#a78bfa" : "none"}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
            
            <Text style={styles.trackingStatus}>
              {isTracking ? 'Tracking your sleep...' : 'Tap to start sleep tracking'}
            </Text>
            
            {isTracking && (
              <View style={styles.trackingInfo}>
                <Text style={styles.trackingTime}>
                  {Math.floor(sleepTimer / 3600)}h {Math.floor((sleepTimer % 3600) / 60)}m
                </Text>
                <Text style={styles.trackingLabel}>Sleep Duration</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Sleep Timer */}
        <View style={styles.timerCard}>
          <View style={styles.sectionHeader}>
            <Timer color="#f59e0b" size={20} />
            <Text style={styles.sectionTitle}>Sleep Timer</Text>
          </View>
          
          <View style={styles.timerOptions}>
            {[15, 30, 60, 90].map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.timerOption,
                  selectedTimer === minutes && styles.timerOptionActive
                ]}
                onPress={() => setSelectedTimer(minutes)}
              >
                <Text style={[
                  styles.timerOptionText,
                  selectedTimer === minutes && styles.timerOptionTextActive
                ]}>
                  {minutes}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sleep Sounds */}
        <View style={styles.soundsCard}>
          <View style={styles.sectionHeader}>
            <Volume2 color="#3b82f6" size={20} />
            <Text style={styles.sectionTitle}>Sleep Sounds</Text>
          </View>
          
          <FlatList
            data={SLEEP_SOUNDS}
            renderItem={renderSoundItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Sleep Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Tonight's Environment</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>72°F</Text>
              <Text style={styles.statLabel}>Temperature</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>45%</Text>
              <Text style={styles.statLabel}>Humidity</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Quiet</Text>
              <Text style={styles.statLabel}>Noise Level</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Dark</Text>
              <Text style={styles.statLabel}>Light Level</Text>
            </View>
          </View>
        </View>

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
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  trackingCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 24,
  },
  trackingCenter: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  trackingRipple1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  trackingRipple2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  trackingButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(167, 139, 250, 0.4)',
  },
  trackingInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingActive: {
    backgroundColor: '#a78bfa',
  },
  trackingStatus: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 16,
  },
  trackingInfo: {
    alignItems: 'center',
  },
  trackingTime: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#a78bfa',
  },
  trackingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginTop: 4,
  },
  timerCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  timerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timerOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timerOptionActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  timerOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#d1d5db',
  },
  timerOptionTextActive: {
    color: '#f59e0b',
  },
  soundsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  soundCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  soundCardActive: {
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  soundIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  soundInfo: {
    flex: 1,
  },
  soundName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 4,
  },
  soundDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  statsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  bottomSpacer: {
    height: 40,
  },
});