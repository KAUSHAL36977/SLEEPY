import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Calendar, Heart, Smile, Meh, Frown, Plus, Star, TrendingUp, CreditCard as Edit3 } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const MOOD_OPTIONS = [
  { id: 1, icon: Smile, label: 'Great', color: '#10b981', value: 5 },
  { id: 2, icon: Smile, label: 'Good', color: '#3b82f6', value: 4 },
  { id: 3, icon: Meh, label: 'Okay', color: '#f59e0b', value: 3 },
  { id: 4, icon: Frown, label: 'Poor', color: '#ef4444', value: 2 },
  { id: 5, icon: Frown, label: 'Terrible', color: '#dc2626', value: 1 },
];

const RECENT_ENTRIES = [
  {
    id: 1,
    date: 'Today',
    mood: 4,
    sleepQuality: 'Good',
    notes: 'Felt refreshed after 8 hours of sleep. Used rain sounds.',
    tags: ['rain-sounds', 'refreshed']
  },
  {
    id: 2,
    date: 'Yesterday',
    mood: 3,
    sleepQuality: 'Okay',
    notes: 'Took longer to fall asleep. Maybe too much caffeine.',
    tags: ['caffeine', 'restless']
  },
  {
    id: 3,
    date: 'Nov 20',
    mood: 5,
    sleepQuality: 'Excellent',
    notes: 'Perfect sleep! Meditation before bed really helped.',
    tags: ['meditation', 'perfect-sleep']
  },
];

// Web-compatible TouchableOpacity wrapper
const WebCompatibleTouchableOpacity = ({ children, style, onPress, ...props }: any) => {
  if (Platform.OS === 'web') {
    // Remove React Native specific props for web
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

export default function JournalScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalText, setJournalText] = useState('');
  const [showNewEntry, setShowNewEntry] = useState(false);

  const fadeAnim = useSharedValue(0);

  const handleMoodSelect = (moodId: number) => {
    setSelectedMood(moodId);
    fadeAnim.value = withSpring(1);
  };

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transformOrigin: '0 0',
  }));

  const getMoodIcon = (moodValue: number) => {
    const mood = MOOD_OPTIONS.find(m => m.value === moodValue);
    return mood ? { Icon: mood.icon, color: mood.color, label: mood.label } : null;
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
          <Text style={styles.title}>Sleep Journal</Text>
          <Text style={styles.subtitle}>Track your sleep thoughts and mood</Text>
        </View>

        {/* Today's Entry */}
        {!showNewEntry ? (
          <WebCompatibleTouchableOpacity 
            style={styles.newEntryCard}
            onPress={() => setShowNewEntry(true)}
          >
            <LinearGradient
              colors={['rgba(167, 139, 250, 0.2)', 'rgba(139, 92, 246, 0.1)']}
              style={styles.cardGradient}
            >
              <Plus color="#a78bfa" size={32} />
              <Text style={styles.newEntryTitle}>Add Today's Entry</Text>
              <Text style={styles.newEntrySubtitle}>
                How was your sleep last night?
              </Text>
            </LinearGradient>
          </WebCompatibleTouchableOpacity>
        ) : (
          <View style={styles.entryCard}>
            <LinearGradient
              colors={['rgba(167, 139, 250, 0.2)', 'rgba(139, 92, 246, 0.1)']}
              style={styles.cardGradient}
            >
              <View style={styles.entryHeader}>
                <Edit3 color="#a78bfa" size={20} />
                <Text style={styles.entryTitle}>Today's Sleep Entry</Text>
              </View>

              {/* Mood Selection */}
              <Text style={styles.sectionLabel}>How do you feel this morning?</Text>
              <View style={styles.moodGrid}>
                {MOOD_OPTIONS.map((mood) => {
                  const IconComponent = mood.icon;
                  const isSelected = selectedMood === mood.id;
                  
                  return (
                    <WebCompatibleTouchableOpacity
                      key={mood.id}
                      style={[
                        styles.moodOption,
                        isSelected && { backgroundColor: mood.color + '30', borderColor: mood.color }
                      ]}
                      onPress={() => handleMoodSelect(mood.id)}
                    >
                      <IconComponent 
                        color={isSelected ? mood.color : '#9ca3af'} 
                        size={24} 
                      />
                      <Text style={[
                        styles.moodLabel,
                        isSelected && { color: mood.color }
                      ]}>
                        {mood.label}
                      </Text>
                    </WebCompatibleTouchableOpacity>
                  );
                })}
              </View>

              {/* Notes Input */}
              <Text style={styles.sectionLabel}>Sleep Notes</Text>
              <TextInput
                style={styles.textInput}
                placeholder="How was your sleep? Any thoughts or observations..."
                placeholderTextColor="#9ca3af"
                value={journalText}
                onChangeText={setJournalText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Save Buttons */}
              <View style={styles.buttonRow}>
                <WebCompatibleTouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowNewEntry(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </WebCompatibleTouchableOpacity>
                
                <WebCompatibleTouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Entry</Text>
                </WebCompatibleTouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Sleep Insights */}
        <View style={styles.insightsCard}>
          <View style={styles.sectionHeader}>
            <TrendingUp color="#10b981" size={20} />
            <Text style={styles.sectionTitle}>This Week's Insights</Text>
          </View>
          
          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Star color="#fbbf24" size={16} />
            </View>
            <Text style={styles.insightText}>
              Your mood improves by 40% when you get 8+ hours of sleep
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Heart color="#f472b6" size={16} />
            </View>
            <Text style={styles.insightText}>
              Meditation before bed correlates with better morning mood
            </Text>
          </View>
        </View>

        {/* Recent Entries */}
        <View style={styles.historyCard}>
          <View style={styles.sectionHeader}>
            <Calendar color="#3b82f6" size={20} />
            <Text style={styles.sectionTitle}>Recent Entries</Text>
          </View>
          
          {RECENT_ENTRIES.map((entry) => {
            const moodData = getMoodIcon(entry.mood);
            
            return (
              <WebCompatibleTouchableOpacity key={entry.id} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                  <View style={styles.historyMood}>
                    {moodData && (
                      <>
                        <moodData.Icon color={moodData.color} size={16} />
                        <Text style={[styles.historyMoodText, { color: moodData.color }]}>
                          {moodData.label}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
                
                <View style={styles.historyRight}>
                  <Text style={styles.historySleep}>{entry.sleepQuality} Sleep</Text>
                  <Text style={styles.historyNotes} numberOfLines={2}>
                    {entry.notes}
                  </Text>
                  
                  <View style={styles.historyTags}>
                    {entry.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </WebCompatibleTouchableOpacity>
            );
          })}
        </View>

        {/* Weekly Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>This Week's Summary</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>4.2</Text>
              <Text style={styles.summaryLabel}>Avg Mood</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>7</Text>
              <Text style={styles.summaryLabel}>Entries</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>85%</Text>
              <Text style={styles.summaryLabel}>Good Days</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>3</Text>
              <Text style={styles.summaryLabel}>Insights</Text>
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
  newEntryCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  entryCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  newEntryTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  newEntrySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
    alignSelf: 'flex-start',
  },
  entryTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    width: '100%',
  },
  moodOption: {
    width: '18%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
    marginTop: 4,
  },
  textInput: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1a1a2e',
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
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  insightIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
    lineHeight: 20,
  },
  historyCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    gap: 16,
  },
  historyLeft: {
    width: 80,
  },
  historyDate: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  historyMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyMoodText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  historyRight: {
    flex: 1,
  },
  historySleep: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a78bfa',
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
    lineHeight: 18,
    marginBottom: 8,
  },
  historyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a78bfa',
  },
  summaryCard: {
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
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#a78bfa',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  bottomSpacer: {
    height: 40,
  },
});