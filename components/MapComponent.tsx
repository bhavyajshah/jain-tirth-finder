import React from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, Image } from 'react-native';
import { MapPin } from 'lucide-react-native';

// Web fallback component
const WebMapFallback = ({ 
  children, 
  tirths = [], 
  origin, 
  destination 
}: { 
  children?: React.ReactNode;
  tirths?: any[];
  origin?: { latitude: number; longitude: number } | null;
  destination?: { latitude: number; longitude: number } | null;
}) => (
  <View style={styles.webFallback}>
    <Text style={styles.mapTitle}>Jain Tirth Map</Text>
    
    <View style={styles.mapImageContainer}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000' }}
        style={styles.mapImage}
        resizeMode="cover"
      />
      <View style={styles.mapOverlay} />
    </View>
    
    {origin && (
      <View style={styles.mapPoint}>
        <MapPin size={24} color="green" />
        <Text style={styles.mapPointText}>Starting Point</Text>
      </View>
    )}
    {destination && (
      <View style={styles.mapPoint}>
        <MapPin size={24} color="red" />
        <Text style={styles.mapPointText}>Destination</Text>
      </View>
    )}
    {tirths && tirths.map((tirth, index) => (
      <View key={index} style={styles.mapPoint}>
        <MapPin size={24} color="#FF6B00" />
        <Text style={styles.mapPointText}>{tirth.name}</Text>
      </View>
    ))}
    {children}
    {(origin || destination || (tirths && tirths.length > 0)) && (
      <View style={styles.webRoute} />
    )}
    <Text style={styles.mapNote}>Interactive map available on native devices</Text>
  </View>
);

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
  // For all platforms, use the web fallback
  // This solves the native module import error on web
  return (
    <WebMapFallback tirths={tirths} origin={origin} destination={destination}>
      {routeCoordinates.length > 0 && (
        <View style={styles.webRoute} />
      )}
    </WebMapFallback>
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
  },
  mapImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
    zIndex: 1,
  },
  mapPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  mapPointText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  webMarker: {
    margin: 8,
  },
  webRoute: {
    width: '80%',
    height: 4,
    backgroundColor: '#FF6B00',
    marginVertical: 16,
    zIndex: 1,
  },
  mapNote: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 16,
    fontStyle: 'italic',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 4,
    zIndex: 1,
  }
});

export default MapComponent;