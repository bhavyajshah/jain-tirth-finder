import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Moon, MapPin, Info, CircleHelp as HelpCircle, LogOut, Globe, Download, Star, Shield, User } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { signOutThunk, updatePreference, updatePreferencesThunk } from '../../store/authSlice';
import LanguageSelector from '../../components/LanguageSelector';
import AuthModal from '../../components/AuthModal';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { isAuthenticated, uid, displayName, preferences } = useSelector((state: RootState) => state.auth);
  
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  // Use preferences from Redux store
  const { 
    notifications, 
    darkMode, 
    locationServices, 
    offlineMode, 
    autoCheckIn, 
    language 
  } = preferences;

  // Update preferences in Firebase when they change
  useEffect(() => {
    if (isAuthenticated && uid) {
      dispatch(updatePreferencesThunk({ userId: uid, preferences }));
    }
  }, [preferences, isAuthenticated, uid]);

  const toggleSwitch = (setting: string, value: boolean) => {
    dispatch(updatePreference({ key: setting as any, value }));
  };

  const handleAbout = () => {
    Alert.alert(
      'About Jain Tirth Finder',
      'Version 1.0.0\n\nJain Tirth Finder helps you discover Jain pilgrimage sites along your travel routes. Plan your journey and never miss an important Tirth.',
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'For assistance, please contact us at support@jaintirthfinder.com',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => dispatch(signOutThunk())
        }
      ]
    );
  };

  const handleLanguageSelect = (languageCode: string) => {
    dispatch(updatePreference({ key: 'language', value: languageCode }));
    setLanguageSelectorVisible(false);
  };

  const getLanguageName = (code: string) => {
    const languages: {[key: string]: string} = {
      'en': 'English',
      'hi': 'Hindi',
      'gu': 'Gujarati',
      'mr': 'Marathi',
      'ta': 'Tamil',
      'te': 'Telugu',
      'kn': 'Kannada',
      'ml': 'Malayalam',
    };
    return languages[code] || 'English';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {isAuthenticated ? (
          <View style={styles.profileSection}>
            <View style={styles.profileIcon}>
              <User size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.profileName}>{displayName}</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => setAuthModalVisible(true)}
          >
            <Text style={styles.loginButtonText}>Sign In / Create Account</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#FF6B00" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
              thumbColor={notifications ? '#FF6B00' : '#F4F4F4'}
              onValueChange={(value) => toggleSwitch('notifications', value)}
              value={notifications}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Moon size={20} color="#FF6B00" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
              thumbColor={darkMode ? '#FF6B00' : '#F4F4F4'}
              onValueChange={(value) => toggleSwitch('darkMode', value)}
              value={darkMode}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MapPin size={20} color="#FF6B00" />
              <Text style={styles.settingText}>Location Services</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
              thumbColor={locationServices ? '#FF6B00' : '#F4F4F4'}
              onValueChange={(value) => toggleSwitch('locationServices', value)}
              value={locationServices}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Download size={20} color="#FF6B00" />
              <Text style={styles.settingText}>Offline Mode</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
              thumbColor={offlineMode ? '#FF6B00' : '#F4F4F4'}
              onValueChange={(value) => toggleSwitch('offlineMode', value)}
              value={offlineMode}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Star size={20} color="#FF6B00" />
              <Text style={styles.settingText}>Auto Check-in</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
              thumbColor={autoCheckIn ? '#FF6B00' : '#F4F4F4'}
              onValueChange={(value) => toggleSwitch('autoCheckIn', value)}
              value={autoCheckIn}
            />
          </View>

          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => setLanguageSelectorVisible(true)}
          >
            <View style={styles.settingInfo}>
              <Globe size={20} color="#FF6B00" />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={styles.languageValue}>
              <Text style={styles.languageText}>{getLanguageName(language)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          
          <TouchableOpacity style={styles.infoItem} onPress={handleAbout}>
            <View style={styles.infoItemContent}>
              <Info size={20} color="#FF6B00" />
              <Text style={styles.infoItemText}>About</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.infoItem} onPress={handleHelp}>
            <View style={styles.infoItemContent}>
              <HelpCircle size={20} color="#FF6B00" />
              <Text style={styles.infoItemText}>Help & Support</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.infoItem}
            onPress={() => Linking.openURL('https://example.com/privacy-policy')}
          >
            <View style={styles.infoItemContent}>
              <Shield size={20} color="#FF6B00" />
              <Text style={styles.infoItemText}>Privacy Policy</Text>
            </View>
          </TouchableOpacity>
        </View>

        {isAuthenticated && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <LanguageSelector
        visible={languageSelectorVisible}
        onClose={() => setLanguageSelectorVisible(false)}
        selectedLanguage={language}
        onSelectLanguage={handleLanguageSelect}
      />

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  loginButton: {
    backgroundColor: '#FF6B00',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  languageValue: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#333333',
  },
  infoItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItemText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
  },
});