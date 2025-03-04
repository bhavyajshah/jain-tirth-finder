import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, TouchableOpacity } from 'react-native';
import { MapPin, Navigation, Info } from 'lucide-react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';

// Web fallback component for development/preview
const WebMapFallback = ({
  children,
  tirths = [],
  origin,
  destination,
  onMarkerPress
}: {
  children?: React.ReactNode;
  tirths?: any[];
  origin?: { latitude: number; longitude: number } | null;
  destination?: { latitude: number; longitude: number } | null;
  onMarkerPress?: (tirth: any) => void;
}) => {
  // This is just a fallback for web preview
  // The actual implementation will use real maps on native devices
  return (
    <View style={styles.webFallback}>
      <Text style={styles.mapTitle}>Interactive Map View</Text>
      <Text style={styles.mapNote}>Showing {tirths.length} Jain Tirths in India</Text>

      {tirths.map((tirth, index) => (
        <TouchableOpacity
          key={index}
          style={styles.mapPoint}
          onPress={() => onMarkerPress && onMarkerPress(tirth)}
        >
          <MapPin size={24} color="#FF6B00" />
          <Text style={styles.mapPointText}>{tirth.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

interface MapComponentProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  tirths?: any[];
  onMarkerPress?: (tirth: any) => void;
  origin?: { latitude: number; longitude: number } | null;
  destination?: { latitude: number; longitude: number } | null;
  routeCoordinates?: { latitude: number; longitude: number }[];
  apiKey?: string;
  onDirectionsReady?: (result: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialRegion,
  tirths = [],
  onMarkerPress,
  origin,
  destination,
  routeCoordinates = [],
  apiKey,
  onDirectionsReady,
}) => {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    })();
  }, []);

  useEffect(() => {
    if (mapReady && mapRef.current && tirths.length > 0) {
      // Fit map to show all markers
      const coordinates = tirths.map(tirth => ({
        latitude: tirth.location.latitude,
        longitude: tirth.location.longitude,
      }));

      if (origin) coordinates.push(origin);
      if (destination) coordinates.push(destination);

      if (coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  }, [mapReady, tirths, origin, destination]);

  // For web platform, use the fallback component
  if (Platform.OS === 'web') {
    return (
      <WebMapFallback
        tirths={tirths}
        origin={origin}
        destination={destination}
        onMarkerPress={onMarkerPress}
      />
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      showsUserLocation={true}
      showsMyLocationButton={true}
      showsCompass={true}
      showsScale={true}
      onMapReady={() => setMapReady(true)}
    >
      {tirths.map((tirth, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: tirth.location.latitude,
            longitude: tirth.location.longitude,
          }}
          title={tirth.name}
          description={tirth.type}
          onPress={() => onMarkerPress && onMarkerPress(tirth)}
        >
          <View style={styles.markerContainer}>
            <MapPin size={30} color="#FF6B00" />
          </View>
        </Marker>
      ))}

      {origin && (
        <Marker
          coordinate={origin}
          title="Starting Point"
        >
          <View style={styles.markerContainer}>
            <MapPin size={30} color="green" />
          </View>
        </Marker>
      )}

      {destination && (
        <Marker
          coordinate={destination}
          title="Destination"
        >
          <View style={styles.markerContainer}>
            <MapPin size={30} color="red" />
          </View>
        </Marker>
      )}

      {routeCoordinates.length > 0 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="#FF6B00"
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  webFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    backgroundImage: 'url(https://images.unsplash.com/photo-1566837497312-7be4ebb09ae3?q=80&w=1000)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 4,
  },
  mapPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPointText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  mapNote: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 16,
    fontStyle: 'italic',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 4,
    zIndex: 1,
  }
});

export default MapComponent;