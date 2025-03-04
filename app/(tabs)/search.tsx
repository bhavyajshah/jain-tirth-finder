import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setActiveRoute, addTirthsAlongRoute } from '../../store/tirthsSlice';
import { Filter, Navigation, Save, Share2, Search as SearchIcon } from 'lucide-react-native';
import FilterModal from '../../components/FilterModal';
import MapComponent from '../../components/MapComponent';

// Custom autocomplete component to replace GooglePlacesAutocomplete
const PlaceAutocomplete = ({ 
  placeholder, 
  onPlaceSelect 
}: { 
  placeholder: string, 
  onPlaceSelect: (place: any) => void 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock places data
  const mockPlaces = [
    { id: '1', name: 'Delhi', location: { lat: 28.7041, lng: 77.1025 } },
    { id: '2', name: 'Mumbai', location: { lat: 19.0760, lng: 72.8777 } },
    { id: '3', name: 'Bangalore', location: { lat: 12.9716, lng: 77.5946 } },
    { id: '4', name: 'Chennai', location: { lat: 13.0827, lng: 80.2707 } },
    { id: '5', name: 'Kolkata', location: { lat: 22.5726, lng: 88.3639 } },
    { id: '6', name: 'Jaipur', location: { lat: 26.9124, lng: 75.7873 } },
    { id: '7', name: 'Ahmedabad', location: { lat: 23.0225, lng: 72.5714 } },
    { id: '8', name: 'Pune', location: { lat: 18.5204, lng: 73.8567 } },
    { id: '9', name: 'Surat', location: { lat: 21.1702, lng: 72.8311 } },
    { id: '10', name: 'Hyderabad', location: { lat: 17.3850, lng: 78.4867 } },
  ];

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      const filtered = mockPlaces.filter(place => 
        place.name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectPlace = (place: any) => {
    setQuery(place.name);
    setShowSuggestions(false);
    onPlaceSelect({
      name: place.name,
      location: place.location
    });
  };

  return (
    <View style={styles.autocompleteContainer}>
      <View style={styles.searchInputContainer}>
        <SearchIcon size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          value={query}
          onChangeText={handleSearch}
        />
      </View>
      
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.suggestionItem}
              onPress={() => handleSelectPlace(place)}
            >
              <Text style={styles.suggestionText}>{place.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function SearchScreen() {
  const dispatch = useDispatch();
  const [origin, setOrigin] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    digambar: true,
    shwetambar: true,
    maxDistance: 5, // km from route
    historical: true,
    modern: true,
    accessibility: false,
    foodAvailable: false,
    accommodationNearby: false
  });
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  const handleRouteSearch = () => {
    if (!origin || !destination) return;
    
    setLoading(true);
    
    // Save to recent searches
    const newSearch = {
      id: Date.now().toString(),
      origin: origin,
      destination: destination,
      date: new Date().toISOString().split('T')[0]
    };
    
    setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);
    
    // In a real app, this would call an API to find Jain Tirths along the route
    // For demo purposes, we'll simulate finding some Tirths
    setTimeout(() => {
      const mockTirths = [
        {
          id: '1',
          name: 'Palitana Temples',
          type: 'Shwetambar',
          location: {
            latitude: (origin.location.lat + destination.location.lat) / 2 - 0.05,
            longitude: (origin.location.lng + destination.location.lng) / 2 - 0.05,
          },
          description: 'Palitana is the world\'s only mountain that has more than 900 temples.',
          images: ['https://images.unsplash.com/photo-1609766418204-df8e0c218ba6'],
          timings: '6:00 AM - 7:00 PM',
          distance: '2.3 km from route',
          rating: 4.8,
          reviews: 245,
          facilities: ['Parking', 'Restrooms', 'Guides'],
          history: 'Built between the 11th and 12th centuries AD, these temples are sacred to the Jain community.',
          significance: 'Considered one of the holiest pilgrimage sites for Jains.',
          events: [
            { name: 'Annual Festival', date: 'February 15-20' },
            { name: 'Special Puja', date: 'Every Full Moon' }
          ]
        },
        {
          id: '2',
          name: 'Ranakpur Temple',
          type: 'Digambar',
          location: {
            latitude: (origin.location.lat + destination.location.lat) / 2 + 0.05,
            longitude: (origin.location.lng + destination.location.lng) / 2 + 0.05,
          },
          description: 'The Ranakpur Jain temple is dedicated to Tirthankara Rishabhanatha.',
          images: ['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1'],
          timings: '7:00 AM - 6:00 PM',
          distance: '1.5 km from route',
          rating: 4.6,
          reviews: 189,
          facilities: ['Parking', 'Restrooms', 'Guides', 'Accommodation'],
          history: 'Built in the 15th century, this temple is known for its intricate marble carvings.',
          significance: 'Famous for its 1444 marble pillars, each uniquely carved.',
          events: [
            { name: 'Mahavir Jayanti', date: 'April 14' },
            { name: 'Paryushan', date: 'August-September' }
          ]
        },
        {
          id: '3',
          name: 'Dilwara Temples',
          type: 'Shwetambar',
          location: {
            latitude: (origin.location.lat + destination.location.lat) / 2 - 0.08,
            longitude: (origin.location.lng + destination.location.lng) / 2 + 0.08,
          },
          description: 'Known for their extraordinary marble carvings, the Dilwara temples are a sacred pilgrimage site.',
          images: ['https://images.unsplash.com/photo-1588096344356-9b02fafabe79'],
          timings: '12:00 PM - 5:00 PM',
          distance: '3.2 km from route',
          rating: 4.9,
          reviews: 320,
          facilities: ['Parking', 'Restrooms', 'Guides', 'Meditation Hall'],
          history: 'Built between the 11th and 13th centuries AD by Vastupala and Tejpala, ministers of the Vaghela ruler of Gujarat.',
          significance: 'Renowned for some of the most exquisite marble carvings in India.',
          events: [
            { name: 'Annual Pilgrimage', date: 'November 10-15' },
            { name: 'Meditation Retreat', date: 'First Sunday of every month' }
          ]
        }
      ];
      
      dispatch(addTirthsAlongRoute(mockTirths));
      dispatch(setActiveRoute({ origin, destination }));
      setLoading(false);
      
      // Set some mock route coordinates for the map
      if (origin && destination) {
        setRouteCoordinates([
          { latitude: origin.location.lat, longitude: origin.location.lng },
          { latitude: (origin.location.lat + destination.location.lat) / 2, longitude: (origin.location.lng + destination.location.lng) / 2 },
          { latitude: destination.location.lat, longitude: destination.location.lng }
        ]);
        
        // Calculate mock distance and duration
        const lat1 = origin.location.lat;
        const lon1 = origin.location.lng;
        const lat2 = destination.location.lat;
        const lon2 = destination.location.lng;
        
        // Simple distance calculation (not accurate for real-world use)
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        
        setDistance(distance.toFixed(0));
        setDuration(Math.round(distance / 60 * 60).toString()); // Assuming 60 km/h average speed
      }
    }, 2000);
  };

  function deg2rad(deg: number) {
    return deg * (Math.PI/180);
  }

  const handleDirectionsReady = (result: any) => {
    setRouteCoordinates(result.coordinates);
    setDistance(result.distance);
    setDuration(result.duration);
  };

  const handleSaveRoute = () => {
    // In a real app, this would save the route to Firebase
    alert('Route saved successfully!');
  };

  const handleShareRoute = () => {
    // In a real app, this would use react-native-share
    alert('Sharing functionality would be implemented here');
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setFilterModalVisible(false);
    // In a real app, this would filter the Tirths based on the selected filters
  };

  const handleRecentSearchSelect = (search: any) => {
    setOrigin(search.origin);
    setDestination(search.destination);
    setShowRecentSearches(false);
  };

  const initialRegion = {
    latitude: 20.5937,  // Default to center of India
    longitude: 78.9629,
    latitudeDelta: 20,
    longitudeDelta: 20,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Plan Your Route</Text>
        {recentSearches.length > 0 && (
          <TouchableOpacity 
            style={styles.recentSearchesButton}
            onPress={() => setShowRecentSearches(!showRecentSearches)}
          >
            <Text style={styles.recentSearchesText}>
              {showRecentSearches ? 'Hide Recent' : 'Recent Searches'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {showRecentSearches && recentSearches.length > 0 && (
          <View style={styles.recentSearchesContainer}>
            <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity 
                key={search.id} 
                style={styles.recentSearchItem}
                onPress={() => handleRecentSearchSelect(search)}
              >
                <Text style={styles.recentSearchText}>
                  {search.origin.name} → {search.destination.name}
                </Text>
                <Text style={styles.recentSearchDate}>{search.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.searchContainer}>
          <Text style={styles.label}>Starting Point</Text>
          <PlaceAutocomplete
            placeholder="Enter starting point"
            onPlaceSelect={(place) => setOrigin(place)}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Destination</Text>
          <PlaceAutocomplete
            placeholder="Enter destination"
            onPlaceSelect={(place) => setDestination(place)}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Filter size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.searchButton, (!origin || !destination || loading) && styles.disabledButton]}
              onPress={handleRouteSearch}
              disabled={!origin || !destination || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Navigation size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Find Route</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {origin && destination && routeCoordinates.length > 0 && (
          <View style={styles.resultsContainer}>
            <View style={styles.routeInfoContainer}>
              <Text style={styles.routeInfoText}>Distance: {distance} km</Text>
              <Text style={styles.routeInfoText}>Duration: {duration} min</Text>
            </View>

            <View style={styles.mapContainer}>
              <MapComponent
                initialRegion={initialRegion}
                origin={origin ? { latitude: origin.location.lat, longitude: origin.location.lng } : null}
                destination={destination ? { latitude: destination.location.lat, longitude: destination.location.lng } : null}
                routeCoordinates={routeCoordinates}
                apiKey=""
                onDirectionsReady={handleDirectionsReady}
              />
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleSaveRoute}
              >
                <Save size={20} color="#FF6B00" />
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShareRoute}
              >
                <Share2 size={20} color="#FF6B00" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApplyFilters={handleFilterChange}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  recentSearchesButton: {
    padding: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  recentSearchesText: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  recentSearchesContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  recentSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentSearchText: {
    fontSize: 14,
    color: '#333333',
  },
  recentSearchDate: {
    fontSize: 12,
    color: '#666666',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  autocompleteContainer: {
    marginBottom: 8,
    zIndex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 2,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666666',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 2,
  },
  disabledButton: {
    backgroundColor: '#FFB380',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  resultsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  routeInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B00',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FF6B00',
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FF6B00',
    fontWeight: '600',
    marginLeft: 8,
  },
});