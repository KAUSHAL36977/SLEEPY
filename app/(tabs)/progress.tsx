import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Calendar, Target, Award, ChartBar as BarChart3, Clock, Moon, Sun, ChevronDown } from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Circle } from 'react-native-progress';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

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

const SLEEP_DATA = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [7.2, 6.8, 8.1, 7.5, 6.9, 8.3, 7.8],
      color: (opacity = 1) => `rgba(167, 139, 250, ${opacity})`,
      strokeWidth: 3,
    },
  ],
};

const SLEEP_QUALITY_DATA = {
  labels: ['Exc', 'Good', 'Fair', 'Poor'],
  datasets: [
    {
      data: [12, 18, 8, 2],
    },
  ],
};

const TIME_PERIODS = ['Week', 'Month', '3 Months', 'Year'];

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [sleepGoal, setSleepGoal] = useState(8);

  const rotateAnim = useSharedValue(0);

  const toggleGoalSelector = () => {
    setShowGoalSelector(!showGoalSelector);
    rotateAnim.value = withSpring(showGoalSelector ? 0 : 180);
  };

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value}deg` }],
  }));

  const getCurrentProgress = () => {
    const avgSleep = 7.5;
    return (avgSleep / sleepGoal) * 100;
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
          <Text style={styles.title}>Sleep Progress</Text>
          <Text style={styles.subtitle}>Track your sleep journey</Text>
        </View>

        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {TIME_PERIODS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sleep Goal Card */}
        <View style={styles.goalCard}>
          <LinearGradient
            colors={['rgba(167, 139, 250, 0.2)', 'rgba(139, 92, 246, 0.1)']}
            style={styles.cardGradient}
          >
            <View style={styles.goalHeader}>
              <Target color="#a78bfa" size={24} />
              <Text style={styles.goalTitle}>Sleep Goal Progress</Text>
              <TouchableOpacity onPress={toggleGoalSelector}>
                <Animated.View style={rotateStyle}>
                  <ChevronDown color="#a78bfa" size={20} />
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View style={styles.goalContent}>
              <Circle
                size={120}
                progress={getCurrentProgress() / 100}
                color="#a78bfa"
                unfilledColor="rgba(255,255,255,0.1)"
                borderWidth={0}
                thickness={12}
                showsText={false}
              />
              
              <View style={styles.goalCenter}>
                <Text style={styles.goalValue}>{getCurrentProgress().toFixed(0)}%</Text>
                <Text style={styles.goalLabel}>Goal: {sleepGoal}h</Text>
              </View>
            </View>

            <Text style={styles.goalDescription}>
              You're averaging 7.5 hours this {selectedPeriod.toLowerCase()}
            </Text>

            {showGoalSelector && (
              <View style={styles.goalSelector}>
                <Text style={styles.goalSelectorLabel}>Adjust your goal:</Text>
                <View style={styles.goalOptions}>
                  {[6, 7, 8, 9, 10].map((hours) => (
                    <TouchableOpacity
                      key={hours}
                      style={[
                        styles.goalOption,
                        sleepGoal === hours && styles.goalOptionActive
                      ]}
                      onPress={() => setSleepGoal(hours)}
                    >
                      <Text style={[
                        styles.goalOptionText,
                        sleepGoal === hours && styles.goalOptionTextActive
                      ]}>
                        {hours}h
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Sleep Trend Chart */}
        <View style={styles.chartCard}>
          <View style={styles.sectionHeader}>
            <TrendingUp color="#3b82f6" size={20} />
            <Text style={styles.sectionTitle}>Sleep Duration Trend</Text>
          </View>
          
          <LineChart
            data={SLEEP_DATA}
            width={screenWidth - 68}
            height={220}
            chartConfig={CHART_CONFIG}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
          />
          
          <View style={styles.chartInsight}>
            <Text style={styles.chartInsightText}>
              📈 Sleep duration improved by 12% this week
            </Text>
          </View>
        </View>

        {/* Sleep Quality Distribution */}
        <View style={styles.chartCard}>
          <View style={styles.sectionHeader}>
            <BarChart3 color="#10b981" size={20} />
            <Text style={styles.sectionTitle}>Sleep Quality Distribution</Text>
          </View>
          
          <BarChart
            data={SLEEP_QUALITY_DATA}
            width={screenWidth - 68}
            height={200}
            chartConfig={{
              ...CHART_CONFIG,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
          />
          
          <View style={styles.qualityLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>30 nights tracked</Text>
            </View>
          </View>
        </View>

        {/* Weekly Stats */}
        <View style={styles.statsCard}>
          <View style={styles.sectionHeader}>
            <Calendar color="#f59e0b" size={20} />
            <Text style={styles.sectionTitle}>This Week's Stats</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Moon color="#a78bfa" size={24} />
              <Text style={styles.statValue}>7.5h</Text>
              <Text style={styles.statLabel}>Avg Sleep</Text>
            </View>
            
            <View style={styles.statItem}>
              <Clock color="#3b82f6" size={24} />
              <Text style={styles.statValue}>10:45</Text>
              <Text style={styles.statLabel}>Avg Bedtime</Text>
            </View>
            
            <View style={styles.statItem}>
              <Sun color="#f59e0b" size={24} />
              <Text style={styles.statValue}>6:15</Text>
              <Text style={styles.statLabel}>Avg Wake</Text>
            </View>
            
            <View style={styles.statItem}>
              <Target color="#10b981" size={24} />
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Goal Rate</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <View style={styles.sectionHeader}>
            <Award color="#fbbf24" size={20} />
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
          </View>
          
          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <Award color="#fbbf24" size={20} />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Sleep Streak Champion</Text>
              <Text style={styles.achievementDescription}>
                12 consecutive days meeting your sleep goal
              </Text>
            </View>
            <Text style={styles.achievementDate}>2 days ago</Text>
          </View>
          
          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <TrendingUp color="#10b981" size={20} />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Consistency Master</Text>
              <Text style={styles.achievementDescription}>
                Sleep schedule within 30 minutes for 7 days
              </Text>
            </View>
            <Text style={styles.achievementDate}>1 week ago</Text>
          </View>
        </View>

        {/* Sleep Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.cardTitle}>Smart Insights</Text>
          
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <Text style={styles.insightEmoji}>🎯</Text>
              <Text style={styles.insightText}>
                You're most consistent on weekdays - try maintaining weekend routines
              </Text>
            </View>
            
            <View style={styles.insightItem}>
              <Text style={styles.insightEmoji}>📱</Text>
              <Text style={styles.insightText}>
                Consider earlier bedtimes - your best sleep happens before 11 PM
              </Text>
            </View>
            
            <View style={styles.insightItem}>
              <Text style={styles.insightEmoji}>🌙</Text>
              <Text style={styles.insightText}>
                Rain sounds improve your sleep quality by 23% on average
              </Text>
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
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodButtonActive: {
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    borderColor: 'rgba(167, 139, 250, 0.4)',
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  periodButtonTextActive: {
    color: '#a78bfa',
  },
  goalCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 24,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  goalTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  goalContent: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  goalCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  goalValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  goalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginTop: 4,
  },
  goalDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
    textAlign: 'center',
  },
  goalSelector: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  goalSelectorLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 12,
  },
  goalOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  goalOption: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  goalOptionActive: {
    backgroundColor: 'rgba(167, 139, 250, 0.3)',
    borderColor: 'rgba(167, 139, 250, 0.5)',
  },
  goalOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  goalOptionTextActive: {
    color: '#a78bfa',
  },
  chartCard: {
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartInsight: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  chartInsightText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
    textAlign: 'center',
  },
  qualityLegend: {
    marginTop: 12,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
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
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  achievementsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  achievementDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  insightsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightEmoji: {
    fontSize: 20,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});