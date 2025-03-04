import { collection, getDocs, addDoc, query, where, GeoPoint, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';

// Collection references
const tirthsCollection = collection(db, 'tirths');
const routesCollection = collection(db, 'routes');

// Get all Jain Tirths
export const getAllTirths = async () => {
  const snapshot = await getDocs(tirthsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Get Tirths by type (Digambar or Shwetambar)
export const getTirthsByType = async (type: string) => {
  const q = query(tirthsCollection, where("type", "==", type));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Get Tirths near a location (within a radius)
export const getTirthsNearLocation = async (latitude: number, longitude: number, radiusKm: number) => {
  // In a real app, we would use Firestore's geoqueries or a cloud function
  // For this demo, we'll fetch all and filter client-side
  const snapshot = await getDocs(tirthsCollection);
  const tirths = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Filter by distance (simplified)
  return tirths.filter((tirth: any) => {
    // Calculate distance (simplified)
    const distance = calculateDistance(
      latitude, 
      longitude, 
      tirth.location.latitude, 
      tirth.location.longitude
    );
    return distance <= radiusKm;
  });
};

// Save a user route
export const saveRoute = async (userId: string, route: any) => {
  return await addDoc(routesCollection, {
    userId,
    origin: route.origin,
    destination: route.destination,
    createdAt: new Date(),
    ...route
  });
};

// Get user's saved routes
export const getUserRoutes = async (userId: string) => {
  const q = query(routesCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Delete a saved route
export const deleteRoute = async (routeId: string) => {
  const routeRef = doc(db, 'routes', routeId);
  await deleteDoc(routeRef);
};

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
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