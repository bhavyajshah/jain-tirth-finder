import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ScrollView, Dimensions, Linking } from 'react-native';
import { X, Clock, MapPin, ExternalLink, Calendar, Star, Info, Camera, Heart } from 'lucide-react-native';
import { AirbnbRating } from 'react-native-ratings';

interface TirthInfoModalProps {
  tirth: any;
  visible: boolean;
  onClose: () => void;
}

export default function TirthInfoModal({ tirth, visible, onClose }: TirthInfoModalProps) {
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showRatingSubmitted, setShowRatingSubmitted] = useState(false);

  if (!tirth) return null;

  const handleAddToCalendar = () => {
    // In a real app, this would use expo-calendar to add an event
    alert('Event would be added to your calendar');
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    setShowRatingSubmitted(true);
    setTimeout(() => {
      setShowRatingSubmitted(false);
    }, 2000);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#333333" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]} 
            onPress={handleToggleFavorite}
          >
            <Heart size={24} color={isFavorite ? "#FF6B00" : "#FFFFFF"} />
          </TouchableOpacity>

          <ScrollView style={styles.scrollView}>
            {tirth.images && tirth.images.length > 0 && (
              <Image
                source={{ uri: tirth.images[0] }}
                style={styles.image}
                resizeMode="cover"
              />
            )}

            <View style={styles.contentContainer}>
              <Text style={styles.title}>{tirth.name}</Text>
              
              <View style={styles.ratingContainer}>
                <View style={styles.typeContainer}>
                  <Text style={styles.typeText}>{tirth.type}</Text>
                </View>

                {tirth.rating && (
                  <View style={styles.ratingBadge}>
                    <Star size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{tirth.rating} ({tirth.reviews})</Text>
                  </View>
                )}
              </View>

              <View style={styles.infoRow}>
                <MapPin size={18} color="#FF6B00" />
                <Text style={styles.infoText}>{tirth.distance}</Text>
              </View>

              <View style={styles.infoRow}>
                <Clock size={18} color="#FF6B00" />
                <Text style={styles.infoText}>{tirth.timings}</Text>
              </View>

              {tirth.facilities && (
                <View style={styles.facilitiesContainer}>
                  {tirth.facilities.map((facility: string, index: number) => (
                    <View key={index} style={styles.facilityBadge}>
                      <Text style={styles.facilityText}>{facility}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tabButton, activeTab === 'about' && styles.activeTabButton]} 
                  onPress={() => setActiveTab('about')}
                >
                  <Text style={[styles.tabButtonText, activeTab === 'about' && styles.activeTabButtonText]}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]} 
                  onPress={() => setActiveTab('history')}
                >
                  <Text style={[styles.tabButtonText, activeTab === 'history' && styles.activeTabButtonText]}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabButton, activeTab === 'events' && styles.activeTabButton]} 
                  onPress={() => setActiveTab('events')}
                >
                  <Text style={[styles.tabButtonText, activeTab === 'events' && styles.activeTabButtonText]}>Events</Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'about' && (
                <>
                  <Text style={styles.sectionTitle}>About</Text>
                  <Text style={styles.description}>{tirth.description}</Text>
                  
                  {tirth.significance && (
                    <>
                      <Text style={styles.sectionTitle}>Significance</Text>
                      <Text style={styles.description}>{tirth.significance}</Text>
                    </>
                  )}

                  <View style={styles.rateContainer}>
                    <Text style={styles.rateTitle}>Rate this Tirth</Text>
                    <AirbnbRating
                      count={5}
                      defaultRating={userRating}
                      size={30}
                      showRating={false}
                      onFinishRating={handleRating}
                    />
                    {showRatingSubmitted && (
                      <Text style={styles.ratingSubmitted}>Thank you for your rating!</Text>
                    )}
                  </View>
                </>
              )}

              {activeTab === 'history' && (
                <>
                  <Text style={styles.sectionTitle}>History</Text>
                  <Text style={styles.description}>
                    {tirth.history || 'This Jain temple has a rich history dating back several centuries. It is an important pilgrimage site for Jains from around the world and showcases magnificent architecture and intricate carvings.'}
                  </Text>
                  
                  <Text style={styles.sectionTitle}>Architecture</Text>
                  <Text style={styles.description}>
                    The temple features intricate marble carvings and detailed sculptures that depict various aspects of Jain mythology and philosophy. The craftsmanship demonstrates the high level of artistic skill prevalent during the period of its construction.
                  </Text>
                </>
              )}

              {activeTab === 'events' && (
                <>
                  <Text style={styles.sectionTitle}>Upcoming Events</Text>
                  
                  {tirth.events ? (
                    tirth.events.map((event: any, index: number) => (
                      <View key={index} style={styles.eventItem}>
                        <View style={styles.eventHeader}>
                          <Text style={styles.eventName}>{event.name}</Text>
                          <TouchableOpacity 
                            style={styles.calendarButton}
                            onPress={handleAddToCalendar}
                          >
                            <Calendar size={16} color="#FF6B00" />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.eventDate}>{event.date}</Text>
                        <Text style={styles.eventDescription}>
                          {event.description || 'Join devotees from around the world for this special occasion. The event includes special prayers, rituals, and community gatherings.'}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.eventItem}>
                      <View style={styles.eventHeader}>
                        <Text style={styles.eventName}>Annual Festival</Text>
                        <TouchableOpacity 
                          style={styles.calendarButton}
                          onPress={handleAddToCalendar}
                        >
                          <Calendar size={16} color="#FF6B00" />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.eventDate}>February 15-20</Text>
                      <Text style={styles.eventDescription}>
                        Join devotees from around the world for this special occasion. The event includes special prayers, rituals, and community gatherings.
                      </Text>
                    </View>
                  )}
                </>
              )}

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${tirth.name}`)}
                >
                  <ExternalLink size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Get Directions</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={() => {}}
                >
                  <Camera size={18} color="#FF6B00" />
                  <Text style={styles.secondaryButtonText}>View Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteButtonActive: {
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeContainer: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  typeText: {
    color: '#FF6B00',
    fontWeight: '600',
    fontSize: 14,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFAEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#333',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 16,
  },
  facilityBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 12,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B00',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabButtonText: {
    color: '#FF6B00',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  rateContainer: {
    marginTop: 24,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  rateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ratingSubmitted: {
    marginTop: 8,
    color: '#4CAF50',
    fontWeight: '500',
  },
  eventItem: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  calendarButton: {
    padding: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '500',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#FF6B00',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});