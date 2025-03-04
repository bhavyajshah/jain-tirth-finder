import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setActiveRoute } from '../../store/tirthsSlice';
import { useRouter } from 'expo-router';
import { MapPin, Navigation, Trash2 } from 'lucide-react-native';

export default function SavedScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [savedRoutes, setSavedRoutes] = useState([
    {
      id: '1',
      origin: { name: 'Delhi', location: { lat: 28.7041, lng: 77.1025 } },
      destination: { name: 'Jaipur', location: { lat: 26.9124, lng: 75.7873 } },
      date: '2025-05-15',
      tirthCount: 3,
      thumbnail: 'https://images.unsplash.com/photo-1477587458883-47145ed94245',
    },
    {
      id: '2',
      origin: { name: 'Mumbai', location: { lat: 19.0760, lng: 72.8777 } },
      destination: { name: 'Ahmedabad', location: { lat: 23.0225, lng: 72.5714 } },
      date: '2025-06-20',
      tirthCount: 5,
      thumbnail: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66',
    },
  ]);

  const handleActivateRoute = (route: any) => {
    dispatch(setActiveRoute(route));
    router.push('/(tabs)/');
  };

  const handleDeleteRoute = (id: string) => {
    setSavedRoutes(savedRoutes.filter(route => route.id !== id));
  };

  const renderRouteItem = ({ item }: { item: any }) => (
    <View style={styles.routeCard}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
      />
      <View style={styles.routeInfo}>
        <Text style={styles.routeName}>{item.origin.name} to {item.destination.name}</Text>
        <Text style={styles.routeDate}>Saved on {item.date}</Text>
        <View style={styles.tirthCount}>
          <MapPin size={16} color="#FF6B00" />
          <Text style={styles.tirthCountText}>{item.tirthCount} Jain Tirths</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.activateButton]}
          onPress={() => handleActivateRoute(item)}
        >
          <Navigation size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteRoute(item.id)}
        >
          <Trash2 size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Routes</Text>
      </View>

      {savedRoutes.length > 0 ? (
        <FlatList
          data={savedRoutes}
          renderItem={renderRouteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved routes yet</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text style={styles.createButtonText}>Create a Route</Text>
          </TouchableOpacity>
        </View>
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
  listContainer: {
    padding: 16,
  },
  routeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 100,
    height: '100%',
  },
  routeInfo: {
    flex: 1,
    padding: 12,
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  routeDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  tirthCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tirthCountText: {
    fontSize: 14,
    color: '#FF6B00',
    marginLeft: 4,
  },
  actionButtons: {
    justifyContent: 'space-between',
    padding: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activateButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});