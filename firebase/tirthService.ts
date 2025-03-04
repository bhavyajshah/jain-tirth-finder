import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  GeoPoint, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

// Collection references
const tirthsCollection = collection(db, 'tirths');
const routesCollection = collection(db, 'routes');
const eventsCollection = collection(db, 'events');
const reviewsCollection = collection(db, 'reviews');

// Types
export interface Tirth {
  id?: string;
  name: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  images: string[];
  timings: string;
  distance?: string;
  rating?: number;
  reviews?: number;
  facilities?: string[];
  history?: string;
  significance?: string;
  events?: Array<{
    name: string;
    date: string;
    description?: string;
  }>;
  createdAt?: any;
  updatedAt?: any;
}

export interface Route {
  id?: string;
  userId: string;
  origin: {
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  destination: {
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  date: string;
  tirthCount: number;
  thumbnail: string;
  createdAt?: any;
}

export interface Event {
  id?: string;
  name: string;
  location: string;
  date: string;
  time: string;
  description: string;
  image: string;
  tirthId?: string;
  createdAt?: any;
}

export interface Review {
  id?: string;
  userId: string;
  userName: string;
  tirthId: string;
  rating: number;
  comment?: string;
  date: any;
}

// Get all Jain Tirths with pagination
export const getAllTirths = async (lastVisible?: DocumentSnapshot, pageSize: number = 10) => {
  try {
    let q = query(
      tirthsCollection, 
      orderBy('name'), 
      limit(pageSize)
    );
    
    if (lastVisible) {
      q = query(
        tirthsCollection,
        orderBy('name'),
        startAfter(lastVisible),
        limit(pageSize)
      );
    }
    
    const snapshot = await getDocs(q);
    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
    
    const tirths = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tirth[];
    
    return { tirths, lastVisible: lastVisibleDoc };
  } catch (error) {
    console.error('Error getting tirths:', error);
    throw error;
  }
};

// Get Tirths by type (Digambar or Shwetambar)
export const getTirthsByType = async (type: string) => {
  try {
    const q = query(tirthsCollection, where("type", "==", type));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tirth[];
  } catch (error) {
    console.error('Error getting tirths by type:', error);
    throw error;
  }
};

// Get a single tirth by ID
export const getTirthById = async (id: string) => {
  try {
    const docRef = doc(db, 'tirths', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Tirth;
    } else {
      throw new Error('Tirth not found');
    }
  } catch (error) {
    console.error('Error getting tirth by ID:', error);
    throw error;
  }
};

// Get Tirths near a location (within a radius)
export const getTirthsNearLocation = async (latitude: number, longitude: number, radiusKm: number) => {
  try {
    // In a real app, we would use Firestore's geoqueries or a cloud function
    // For this implementation, we'll fetch all and filter client-side
    const snapshot = await getDocs(tirthsCollection);
    const tirths = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tirth[];
    
    // Filter by distance
    return tirths.filter((tirth) => {
      // Calculate distance
      const distance = calculateDistance(
        latitude, 
        longitude, 
        tirth.location.latitude, 
        tirth.location.longitude
      );
      return distance <= radiusKm;
    });
  } catch (error) {
    console.error('Error getting tirths near location:', error);
    throw error;
  }
};

// Add a new tirth
export const addTirth = async (tirth: Omit<Tirth, 'id'>) => {
  try {
    const docRef = await addDoc(tirthsCollection, {
      ...tirth,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding tirth:', error);
    throw error;
  }
};

// Update a tirth
export const updateTirth = async (id: string, data: Partial<Tirth>) => {
  try {
    const tirthRef = doc(db, 'tirths', id);
    await updateDoc(tirthRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating tirth:', error);
    throw error;
  }
};

// Delete a tirth
export const deleteTirth = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'tirths', id));
  } catch (error) {
    console.error('Error deleting tirth:', error);
    throw error;
  }
};

// Upload an image for a tirth
export const uploadTirthImage = async (tirthId: string, uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const filename = `tirths/${tirthId}/${Date.now()}`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Save a user route
export const saveRoute = async (route: Omit<Route, 'id'>) => {
  try {
    const docRef = await addDoc(routesCollection, {
      ...route,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving route:', error);
    throw error;
  }
};

// Get user's saved routes
export const getUserRoutes = async (userId: string) => {
  try {
    const q = query(
      routesCollection, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Route[];
  } catch (error) {
    console.error('Error getting user routes:', error);
    throw error;
  }
};

// Delete a saved route
export const deleteRoute = async (routeId: string) => {
  try {
    await deleteDoc(doc(db, 'routes', routeId));
  } catch (error) {
    console.error('Error deleting route:', error);
    throw error;
  }
};

// Get all events
export const getAllEvents = async () => {
  try {
    const q = query(eventsCollection, orderBy("date"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

// Get upcoming events
export const getUpcomingEvents = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      eventsCollection, 
      where("date", ">=", today),
      orderBy("date")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    throw error;
  }
};

// Get past events
export const getPastEvents = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      eventsCollection, 
      where("date", "<", today),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error getting past events:', error);
    throw error;
  }
};

// Add a review
export const addReview = async (review: Omit<Review, 'id' | 'date'>) => {
  try {
    // Add the review
    const reviewData = {
      ...review,
      date: serverTimestamp()
    };
    
    const docRef = await addDoc(reviewsCollection, reviewData);
    
    // Update the tirth's rating
    const tirthRef = doc(db, 'tirths', review.tirthId);
    const tirthDoc = await getDoc(tirthRef);
    
    if (tirthDoc.exists()) {
      const tirthData = tirthDoc.data();
      const currentRating = tirthData.rating || 0;
      const currentReviews = tirthData.reviews || 0;
      
      // Calculate new rating
      const newRating = (currentRating * currentReviews + review.rating) / (currentReviews + 1);
      
      // Update tirth document
      await updateDoc(tirthRef, {
        rating: newRating,
        reviews: currentReviews + 1
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Get reviews for a tirth
export const getTirthReviews = async (tirthId: string) => {
  try {
    const q = query(
      reviewsCollection, 
      where("tirthId", "==", tirthId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Review[];
  } catch (error) {
    console.error('Error getting tirth reviews:', error);
    throw error;
  }
};

// Helper function to calculate distance between two points (Haversine formula)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}