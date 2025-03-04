import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, Bell, Filter } from 'lucide-react-native';

export default function EventsScreen() {
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [notificationEnabled, setNotificationEnabled] = useState<{[key: string]: boolean}>({});

  const events = [
    {
      id: '1',
      name: 'Mahavir Jayanti Celebration',
      location: 'Palitana Temples',
      date: '2025-04-14',
      time: '6:00 AM - 8:00 PM',
      description: 'Annual celebration of Lord Mahavir\'s birth with special prayers and rituals.',
      image: 'https://images.unsplash.com/photo-1609766418204-df8e0c218ba6',
    },
    {
      id: '2',
      name: 'Paryushan Parva',
      location: 'Ranakpur Temple',
      date: '2025-08-15',
      time: '7:00 AM - 9:00 PM',
      description: 'Eight-day festival of spiritual awakening and renewal.',
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1',
    },
    {
      id: '3',
      name: 'Das Lakshana Festival',
      location: 'Dilwara Temples',
      date: '2025-08-23',
      time: '6:00 AM - 7:00 PM',
      description: 'Ten-day festival following Paryushan celebrating the ten virtues.',
      image: 'https://images.unsplash.com/photo-1588096344356-9b02fafabe79',
    },
    {
      id: '4',
      name: 'Diwali & New Year Celebration',
      location: 'Shri Digambar Jain Lal Mandir',
      date: '2025-11-12',
      time: '5:00 PM - 10:00 PM',
      description: 'Celebration of Diwali and the Jain New Year with special prayers and lighting ceremonies.',
      image: 'https://images.unsplash.com/photo-1605559911160-e31b204c6734',
    },
  ];

  const pastEvents = [
    {
      id: '5',
      name: 'Akshaya Tritiya',
      location: 'Sonagiri Jain Temple',
      date: '2025-01-22',
      time: '7:00 AM - 7:00 PM',
      description: 'Celebration of the third day of the bright half of the lunar month of Vaishakha.',
      image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be',
    },
    {
      id: '6',
      name: 'Jain Meditation Retreat',
      location: 'Shravanabelagola',
      date: '2025-02-10',
      time: '6:00 AM - 6:00 PM',
      description: 'Three-day meditation retreat focusing on Jain principles and practices.',
      image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
    },
  ];

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
        data={activeFilter === 'upcoming' ? events : pastEvents}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.eventList}
        showsVerticalScrollIndicator={false}
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
});