import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MapPin, Info, List, Layers, Navigation } from 'lucide-react-native';
import TirthInfoModal from '../../components/TirthInfoModal';
import MapComponent from '../../components/MapComponent';
import * as Location from 'expo-location';

export default function ExploreScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedTirth, setSelectedTirth] = useState<any>(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [showTirthList, setShowTirthList] = useState(false);
  const [mapType, setMapType] = useState('standard');
  
  const { tirths, activeRoute } = useSelector((state: RootState) => state.tirths);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleMarkerPress = (tirth: any) => {
    setSelectedTirth(tirth);
    setInfoModalVisible(true);
  };

  const toggleTirthList = () => {
    setShowTirthList(!showTirthList);
  };

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const renderTirthItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.tirthItem}
      onPress={() => handleMarkerPress(item)}
    >
      <View style={styles.tirthItemContent}>
        <View style={styles.tirthItemHeader}>
          <Text style={styles.tirthItemName}>{item.name}</Text>
          <View style={styles.tirthItemType}>
            <Text style={styles.tirthItemTypeText}>{item.type}</Text>
          </View>
        </View>
        <View style={styles.tirthItemInfo}>
          <MapPin size={16} color="#FF6B00" />
          <Text style={styles.tirthItemDistance}>{item.distance}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.tirthItemAction}
        onPress={() => {}}
      >
        <Navigation size={20} color="#FF6B00" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const initialRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : {
    latitude: 20.5937,  // Default to center of India
    longitude: 78.9629,
    latitudeDelta: 20,
    longitudeDelta: 20,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Jain Tirth Finder</Text>
        {activeRoute && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeText}>
              Active Route: {activeRoute.origin.name} to {activeRoute.destination.name}
            </Text>
          </View>
        )}
      </View>

      {errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          <MapComponent 
            initialRegion={initialRegion}
            tirths={tirths}
            onMarkerPress={handleMarkerPress}
          />

          <View style={styles.mapControls}>
            <TouchableOpacity 
              style={styles.mapControlButton}
              onPress={toggleMapType}
            >
              <Layers size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.mapControlButton}
              onPress={toggleTirthList}
            >
              <List size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.mapControlButton}
              onPress={() => {}}
            >
              <Info size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {showTirthList && (
            <View style={styles.tirthListContainer}>
              <View style={styles.tirthListHeader}>
                <Text style={styles.tirthListTitle}>Nearby Tirths</Text>
                <TouchableOpacity onPress={toggleTirthList}>
                  <Text style={styles.tirthListClose}>Close</Text>
                </TouchableOpacity>
              </View>
              
              {tirths.length > 0 ? (
                <FlatList
                  data={tirths}
                  renderItem={renderTirthItem}
                  keyExtractor={item => item.id}
                  style={styles.tirthList}
                />
              ) : (
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>No tirths found nearby</Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {selectedTirth && (
        <TirthInfoModal
          tirth={selectedTirth}
          visible={infoModalVisible}
          onClose={() => setInfoModalVisible(false)}
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
  routeInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  routeText: {
    fontSize: 14,
    color: '#FF6B00',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
  },
  mapControlButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FF6B00',
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  tirthListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tirthListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tirthListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  tirthListClose: {
    fontSize: 16,
    color: '#FF6B00',
  },
  tirthList: {
    maxHeight: '100%',
  },
  tirthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tirthItemContent: {
    flex: 1,
  },
  tirthItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tirthItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  tirthItemType: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tirthItemTypeText: {
    fontSize: 12,
    color: '#FF6B00',
  },
  tirthItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tirthItemDistance: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  tirthItemAction: {
    padding: 8,
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});