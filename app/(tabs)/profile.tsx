import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, User, Bell, Moon, Palette, Shield, CircleHelp as HelpCircle, Star, Crown, ChevronRight, LogOut, Download, Trash2 } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [premiumUser, setPremiumUser] = useState(false);
  const [smartAlerts, setSmartAlerts] = useState(true);
  const [dataSync, setDataSync] = useState(false);

  const handleUpgradeToPremium = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Unlock advanced sleep coaching, premium sounds, and detailed analytics for $4.99/month.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => console.log('Upgrade pressed') }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Sleep Data',
      'Your sleep data will be exported as a CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Export pressed') }
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your sleep data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete pressed') }
      ]
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
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your sleep preferences</Text>
        </View>

        {/* User Profile */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['rgba(167, 139, 250, 0.2)', 'rgba(139, 92, 246, 0.1)']}
            style={styles.cardGradient}
          >
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <User color="#a78bfa" size={32} />
              </View>
              
              <View style={styles.userDetails}>
                <Text style={styles.userName}>Sleep Enthusiast</Text>
                <Text style={styles.userStats}>
                  12 day streak • 156 nights tracked
                </Text>
              </View>
              
              {!premiumUser && (
                <TouchableOpacity 
                  style={styles.premiumBadge}
                  onPress={handleUpgradeToPremium}
                >
                  <Crown color="#fbbf24" size={16} />
                  <Text style={styles.premiumText}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Sleep Preferences */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Moon color="#a78bfa" size={20} />
            <Text style={styles.sectionTitle}>Sleep Preferences</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Smart Sleep Alerts</Text>
              <Text style={styles.settingDescription}>
                Get personalized bedtime reminders
              </Text>
            </View>
            <Switch
              value={smartAlerts}
              onValueChange={setSmartAlerts}
              trackColor={{ false: '#374151', true: '#a78bfa40' }}
              thumbColor={smartAlerts ? '#a78bfa' : '#9ca3af'}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Sleep Goal</Text>
              <Text style={styles.settingDescription}>8 hours per night</Text>
            </View>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Bedtime Schedule</Text>
              <Text style={styles.settingDescription}>10:30 PM - 6:30 AM</Text>
            </View>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Bell color="#3b82f6" size={20} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Sleep reminders and insights
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#374151', true: '#3b82f640' }}
              thumbColor={notifications ? '#3b82f6' : '#9ca3af'}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Notification Schedule</Text>
              <Text style={styles.settingDescription}>9:30 PM - 7:00 AM</Text>
            </View>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Palette color="#10b981" size={20} />
            <Text style={styles.sectionTitle}>App Settings</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Always enabled for better sleep
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#374151', true: '#10b98140' }}
              thumbColor={darkMode ? '#10b981' : '#9ca3af'}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Sound Quality</Text>
              <Text style={styles.settingDescription}>High (Premium)</Text>
            </View>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>
        </View>

        {/* Data & Privacy */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Shield color="#f59e0b" size={20} />
            <Text style={styles.sectionTitle}>Data & Privacy</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Cloud Sync</Text>
              <Text style={styles.settingDescription}>
                Backup data to secure cloud
              </Text>
            </View>
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
              trackColor={{ false: '#374151', true: '#f59e0b40' }}
              thumbColor={dataSync ? '#f59e0b' : '#9ca3af'}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleExportData}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingDescription}>
                Download your sleep data
              </Text>
            </View>
            <Download color="#9ca3af" size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                How we protect your data
              </Text>
            </View>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>
        </View>

        {/* Premium Features */}
        {!premiumUser && (
          <TouchableOpacity 
            style={styles.premiumCard}
            onPress={handleUpgradeToPremium}
          >
            <LinearGradient
              colors={['rgba(251, 191, 36, 0.2)', 'rgba(245, 158, 11, 0.1)']}
              style={styles.cardGradient}
            >
              <View style={styles.premiumHeader}>
                <Crown color="#fbbf24" size={24} />
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              </View>
              
              <Text style={styles.premiumDescription}>
                Unlock advanced sleep coaching, premium sounds, detailed analytics, and more.
              </Text>
              
              <View style={styles.premiumFeatures}>
                <Text style={styles.premiumFeature}>• Advanced AI Sleep Coaching</Text>
                <Text style={styles.premiumFeature}>• Premium Sound Library</Text>
                <Text style={styles.premiumFeature}>• Detailed Sleep Analytics</Text>
                <Text style={styles.premiumFeature}>• Export & Cloud Backup</Text>
              </View>
              
              <View style={styles.premiumPrice}>
                <Text style={styles.priceText}>$4.99/month</Text>
                <Text style={styles.priceSubtext}>Cancel anytime</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Support */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <HelpCircle color="#8b5cf6" size={20} />
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Help Center</Text>
              <Text style={styles.settingDescription}>
                Get answers to common questions
              </Text>
            </View>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Rate RestWell</Text>
              <Text style={styles.settingDescription}>
                Love the app? Leave us a review!
              </Text>
            </View>
            <Star color="#fbbf24" size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Contact Support</Text>
              <Text style={styles.settingDescription}>
                Get help from our team
              </Text>
            </View>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={styles.dangerItem}
            onPress={handleDeleteData}
          >
            <Trash2 color="#ef4444" size={20} />
            <Text style={styles.dangerText}>Delete All Sleep Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dangerItem}>
            <LogOut color="#ef4444" size={20} />
            <Text style={styles.dangerText}>Sign Out</Text>
          </TouchableOpacity>
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
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(167, 139, 250, 0.4)',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    gap: 4,
  },
  premiumText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fbbf24',
  },
  sectionCard: {
    marginHorizontal: 24,
    marginBottom: 20,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    gap: 16,
  },
  settingLeft: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  premiumCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  premiumTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  premiumDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
    marginBottom: 16,
    lineHeight: 22,
  },
  premiumFeatures: {
    marginBottom: 20,
  },
  premiumFeature: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fbbf24',
    marginBottom: 6,
  },
  premiumPrice: {
    alignItems: 'center',
  },
  priceText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fbbf24',
    marginBottom: 4,
  },
  priceSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  dangerCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  dangerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
    marginBottom: 16,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239, 68, 68, 0.1)',
    gap: 12,
  },
  dangerText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
  },
  bottomSpacer: {
    height: 40,
  },
});