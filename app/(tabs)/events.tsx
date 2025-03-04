import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, Bell, Filter } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchEventsThunk } from '../../store/tirthsSlice';

export default function EventsScreen() {
  const dispatch = useDispatch();
  const { upcomingEvents, pastEvents, loading, error } = useSelector((state: RootState) => state.tirths);
  
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [notificationEnabled, setNotificationEnabled] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    dispatch(fetchEventsThunk());
  }, [dispatch]);

  const toggleNotification = (id: string) => {
    setNotificationEnabled(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderEventItem = ({ item }: { item: any }) => {
    const isNotificationEnabled = notificationEnabled[item.id] || false;
    
    return (
      <View style={styles.eventCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.eventImage}
        />
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventName}>{item.name}</Text>
            <TouchableOpacity 
              style={[styles.notificationButton, isNotificationEnabled && styles.notificationEnabled]}
              onPress={() => toggleNotification(item.id)}
            >
              <Bell size={16} color={isNotificationEnabled ? "#FFFFFF" : "#FF6B00"} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.eventInfo}>
            <View style={styles.infoRow}>
              <Calendar size={16} color="#FF6B00" />
              <Text style={styles.infoText}>{item.date}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Clock size={16} color="#FF6B00" />
              <Text style={styles.infoText}>{item.time}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MapPin size={16} color="#FF6B00" />
              <Text style={styles.infoText}>{item.location}</Text>
            </View>
          </View>
          
          <Text style={styles.eventDescription}>{item.description}</Text>
          
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && !upcomingEvents.length && !pastEvents.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Jain Events</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Jain Events</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading events. Please try again later.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Jain Events</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#333333" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'upcoming' && styles.activeFilterTab]}
          onPress={() => setActiveFilter('upcoming')}
        >
          <Text style={[styles.filterTabText, activeFilter === 'upcoming' && styles.activeFilterTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'past' && styles.activeFilterTab]}
          onPress={() => setActiveFilter('past')}
        >
          <Text style={[styles.filterTabText, activeFilter === 'past' && styles.activeFilterTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeFilter === 'upcoming' ? upcomingEvents : pastEvents}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.eventList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeFilter === 'upcoming' 
                ? 'No upcoming events found' 
                : 'No past events found'}
            </Text>
          </View>
        }
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: '#FF6B00',
  },
  filterTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  activeFilterTabText: {
    color: '#FF6B00',
  },
  eventList: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  notificationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationEnabled: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  eventInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#FF6B00',
    fontWeight: '600',
    fontSize: 14,
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});