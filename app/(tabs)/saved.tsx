import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setActiveRoute } from '../../store/tirthsSlice';
import { fetchUserRoutesThunk, deleteRouteThunk } from '../../store/tirthsSlice';
import { useRouter } from 'expo-router';
import { MapPin, Navigation, Trash2 } from 'lucide-react-native';
import AuthModal from '../../components/AuthModal';

export default function SavedScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { savedRoutes, loading, error, favorites, tirths } = useSelector((state: RootState) => state.tirths);
  const { isAuthenticated, uid } = useSelector((state: RootState) => state.auth);
  
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('routes');

  // Get favorite tirths
  const favoriteTirths = tirths.filter(tirth => favorites.includes(tirth.id));

  useEffect(() => {
    if (isAuthenticated && uid) {
      dispatch(fetchUserRoutesThunk(uid));
    }
  }, [isAuthenticated, uid, dispatch]);

  const handleActivateRoute = (route: any) => {
    dispatch(setActiveRoute(route));
    router.push('/(tabs)/');
  };

  const handleDeleteRoute = (routeId: string) => {
    dispatch(deleteRouteThunk(routeId));
  };

  const renderRouteItem = ({ item }: { item: any }) => (
    <View style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{item.origin.name} to {item.destination.name}</Text>
          <Text style={styles.routeDate}>{item.date}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteRoute(item.id)}
        >
          <Trash2 size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.routeDetails}>
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#FF6B00" />
          <Text style={styles.locationText}>{item.origin.name}</Text>
        </View>
        
        <View style={styles.routeLine} />
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#FF6B00" />
          <Text style={styles.locationText}>{item.destination.name}</Text>
        </View>
      </View>
      
      <View style={styles.routeStats}>
        <Text style={styles.statsText}>{item.tirthCount} Tirths along route</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.activateButton}
        onPress={() => handleActivateRoute(item)}
      >
        <Navigation size={20} color="#FFFFFF" />
        <Text style={styles.activateButtonText}>Activate Route</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.favoriteCard}>
      <Image
        source={{ uri: item.images[0] }}
        style={styles.favoriteImage}
      />
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteHeader}>
          <Text style={styles.favoriteName}>{item.name}</Text>
          <View style={styles.favoriteType}>
            <Text style={styles.favoriteTypeText}>{item.type}</Text>
          </View>
        </View>
        
        <View style={styles.favoriteInfo}>
          <MapPin size={16} color="#FF6B00" />
          <Text style={styles.favoriteInfoText}>{item.distance}</Text>
        </View>
        
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved</Text>
        </View>
        
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Sign in to view your saved routes and favorites</Text>
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => setAuthModalVisible(true)}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        
        <AuthModal
          visible={authModalVisible}
          onClose={() => setAuthModalVisible(false)}
        />
      </SafeAreaView>
    );
  }

  if (loading && !savedRoutes.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Loading saved items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'routes' && styles.activeTab]}
          onPress={() => setActiveTab('routes')}
        >
          <Text style={[styles.tabText, activeTab === 'routes' && styles.activeTabText]}>Routes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>Favorites</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'routes' ? (
        <FlatList
          data={savedRoutes}
          renderItem={renderRouteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No saved routes found</Text>
              <TouchableOpacity 
                style={styles.createRouteButton}
                onPress={() => router.push('/(tabs)/search')}
              >
                <Text style={styles.createRouteText}>Create a Route</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <FlatList
          data={favoriteTirths}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No favorite tirths found</Text>
              <TouchableOpacity 
                style={styles.createRouteButton}
                onPress={() => router.push('/(tabs)/')}
              >
                <Text style={styles.createRouteText}>Explore Tirths</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF6B00',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#FF6B00',
  },
  listContent: {
    padding: 16,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  routeDate: {
    fontSize: 14,
    color: '#666666',
  },
  deleteButton: {
    padding: 8,
  },
  routeDetails: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E5E5',
    marginLeft: 8,
    marginVertical: 4,
  },
  routeStats: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#FF6B00',
  },
  activateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    padding: 12,
    borderRadius: 8,
  },
  activateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
  },
  favoriteImage: {
    width: 100,
    height: '100%',
  },
  favoriteContent: {
    flex: 1,
    padding: 12,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
    flex: 1,
  },
  favoriteType: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  favoriteTypeText: {
    fontSize: 12,
    color: '#FF6B00',
  },
  favoriteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  favoriteInfoText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
  },
  viewDetailsText: {
    color: '#FF6B00',
    fontWeight: '500',
    fontSize: 12,
  },
  signInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  signInText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  createRouteButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createRouteText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});