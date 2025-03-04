import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    digambar: boolean;
    shwetambar: boolean;
    maxDistance: number;
    historical?: boolean;
    modern?: boolean;
    accessibility?: boolean;
    foodAvailable?: boolean;
    accommodationNearby?: boolean;
  };
  onApplyFilters: (filters: any) => void;
}

export default function FilterModal({ visible, onClose, filters, onApplyFilters }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleToggle = (key: string, value: boolean) => {
    setLocalFilters({
      ...localFilters,
      [key]: value,
    });
  };

  const handleSliderChange = (value: number) => {
    setLocalFilters({
      ...localFilters,
      maxDistance: value,
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({
      digambar: true,
      shwetambar: true,
      maxDistance: 5,
      historical: true,
      modern: true,
      accessibility: false,
      foodAvailable: false,
      accommodationNearby: false
    });
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
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#333333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tirth Type</Text>
              
              <View style={styles.filterItem}>
                <Text style={styles.filterText}>Digambar</Text>
                <Switch
                  trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
                  thumbColor={localFilters.digambar ? '#FF6B00' : '#F4F4F4'}
                  onValueChange={(value) => handleToggle('digambar', value)}
                  value={localFilters.digambar}
                />
              </View>
              
              <View style={styles.filterItem}>
                <Text style={styles.filterText}>Shwetambar</Text>
                <Switch
                  trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
                  thumbColor={localFilters.shwetambar ? '#FF6B00' : '#F4F4F4'}
                  onValueChange={(value) => handleToggle('shwetambar', value)}
                  value={localFilters.shwetambar}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Temple Age</Text>
              
              <View style={styles.filterItem}>
                <Text style={styles.filterText}>Historical (> 100 years)</Text>
                <Switch
                  trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
                  thumbColor={localFilters.historical ? '#FF6B00' : '#F4F4F4'}
                  onValueChange={(value) => handleToggle('historical', value)}
                  value={localFilters.historical}
                />
              </View>
              
              <View style={styles.filterItem}>
                <Text style={styles.filterText}>Modern (< 100 years)</Text>
                <Switch
                  trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
                  thumbColor={localFilters.modern ? '#FF6B00' : '#F4F4F4'}
                  onValueChange={(value) => handleToggle('modern', value)}
                  value={localFilters.modern}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Facilities</Text>
              
              <View style={styles.filterItem}>
                <Text style={styles.filterText}>Accessibility Features</Text>
                <Switch
                  trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
                  thumbColor={localFilters.accessibility ? '#FF6B00' : '#F4F4F4'}
                  onValueChange={(value) => handleToggle('accessibility', value)}
                  value={localFilters.accessibility}
                />
              </View>
              
              <View style={styles.filterItem}>
                <Text style={styles.filterText}>Food Available</Text>
                <Switch
                  trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
                  thumbColor={localFilters.foodAvailable ? '#FF6B00' : '#F4F4F4'}
                  onValueChange={(value) => handleToggle('foodAvailable', value)}
                  value={localFilters.foodAvailable}
                />
              </View>
              
              <View style={styles.filterItem}>
                <Text style={styles.filterText}>Accommodation Nearby</Text>
                <Switch
                  trackColor={{ false: '#E5E5E5', true: '#FFD3B6' }}
                  thumbColor={localFilters.accommodationNearby ? '#FF6B00' : '#F4F4F4'}
                  onValueChange={(value) => handleToggle('accommodationNearby', value)}
                  value={localFilters.accommodationNearby}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Maximum Distance from Route</Text>
              <Text style={styles.distanceValue}>{localFilters.maxDistance} km</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>1 km</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={20}
                  step={1}
                  value={localFilters.maxDistance}
                  onValueChange={handleSliderChange}
                  minimumTrackTintColor="#FF6B00"
                  maximumTrackTintColor="#E5E5E5"
                  thumbTintColor="#FF6B00"
                />
                <Text style={styles.sliderLabel}>20 km</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  scrollView: {
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterText: {
    fontSize: 16,
    color: '#333333',
  },
  distanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  resetButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6B00',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FF6B00',
    fontWeight: '600',
    fontSize: 16,
  },
  applyButton: {
    flex: 2,
    padding: 12,
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});