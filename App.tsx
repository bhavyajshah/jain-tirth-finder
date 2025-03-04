import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './store';
import { loadUserFromStorage } from './store/authSlice';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ExpoRoot } from 'expo-router';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('expo-font/build/Inter-Regular.ttf'),
    'Inter-Bold': require('expo-font/build/Inter-Bold.ttf'),
  });

  useEffect(() => {
    // Load user from AsyncStorage
    store.dispatch(loadUserFromStorage());

    // Hide splash screen once fonts are loaded
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {
        /* reloading the app might trigger some race conditions, ignore them */
      });
    }
  }, [fontsLoaded, fontError]);

  // Return loading screen while fonts load
  if (!fontsLoaded && !fontError) {
    return (
      <Provider store={store}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Loading Jain Tirth Finder...</Text>
        </View>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ExpoRoot context={require.context('./app')} />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
});