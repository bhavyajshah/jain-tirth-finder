import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getAllTirths,
  getTirthsByType,
  getTirthsNearLocation,
  getTirthById,
  saveRoute,
  getUserRoutes,
  deleteRoute,
  getUpcomingEvents,
  getPastEvents,
  addReview,
  getTirthReviews,
  Tirth,
  Route,
  Event,
  Review
} from '../firebase/tirthService';
import { DocumentSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TirthsState {
  tirths: Tirth[];
  activeRoute: {
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
  } | null;
  savedRoutes: Route[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  favorites: string[];
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
  loading: boolean;
  error: string | null;
  lastVisible: DocumentSnapshot | null;
  hasMore: boolean;
}

const initialState: TirthsState = {
  tirths: [],
  activeRoute: null,
  savedRoutes: [],
  upcomingEvents: [],
  pastEvents: [],
  favorites: [],
  filters: {
    digambar: true,
    shwetambar: true,
    maxDistance: 5,
    historical: true,
    modern: true,
    accessibility: false,
    foodAvailable: false,
    accommodationNearby: false
  },
  loading: false,
  error: null,
  lastVisible: null,
  hasMore: true
};

// Mock data for development
const mockTirths: Tirth[] = [
  {
    id: '1',
    name: 'Palitana Temples',
    type: 'Shwetambar',
    location: {
      latitude: 21.4859,
      longitude: 71.8496,
    },
    description: 'Palitana is the world\'s only mountain that has more than 900 temples. It is considered the most sacred pilgrimage site for Jains.',
    images: ['https://images.unsplash.com/photo-1609766418204-df8e0c218ba6'],
    timings: '6:00 AM - 7:00 PM',
    distance: '2.3 km',
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
      latitude: 25.1162,
      longitude: 73.4872,
    },
    description: 'The Ranakpur Jain temple is dedicated to Tirthankara Rishabhanatha. Known for its 1444 marble pillars, each uniquely carved.',
    images: ['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1'],
    timings: '7:00 AM - 6:00 PM',
    distance: '1.5 km',
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
      latitude: 24.6167,
      longitude: 72.7167,
    },
    description: 'Known for their extraordinary marble carvings, the Dilwara temples are a sacred pilgrimage site.',
    images: ['https://images.unsplash.com/photo-1588096344356-9b02fafabe79'],
    timings: '12:00 PM - 5:00 PM',
    distance: '3.2 km',
    rating: 4.9,
    reviews: 320,
    facilities: ['Parking', 'Restrooms', 'Guides', 'Meditation Hall'],
    history: 'Built between the 11th and 13th centuries AD by Vastupala and Tejpala, ministers of the Vaghela ruler of Gujarat.',
    significance: 'Renowned for some of the most exquisite marble carvings in India.',
    events: [
      { name: 'Annual Pilgrimage', date: 'November 10-15' },
      { name: 'Meditation Retreat', date: 'First Sunday of every month' }
    ]
  },
  {
    id: '4',
    name: 'Shri Mahavir Swami Jain Temple',
    type: 'Digambar',
    location: {
      latitude: 28.6562,
      longitude: 77.2410,
    },
    description: 'A beautiful Jain temple in Delhi dedicated to Lord Mahavir, the 24th Tirthankara of Jainism.',
    images: ['https://images.unsplash.com/photo-1588096344356-9b02fafabe79'],
    timings: '5:00 AM - 9:00 PM',
    distance: '5.1 km',
    rating: 4.7,
    reviews: 178,
    facilities: ['Parking', 'Restrooms', 'Meditation Hall', 'Library'],
    history: 'This temple was built in the 20th century and serves as an important center for Jain religious activities in Delhi.',
    significance: 'Houses beautiful idols of Tirthankaras and is known for its peaceful atmosphere.',
    events: [
      { name: 'Mahavir Jayanti Celebration', date: 'April 14' },
      { name: 'Weekly Discourse', date: 'Every Sunday' }
    ]
  },
  {
    id: '5',
    name: 'Gomateshwara Temple',
    type: 'Digambar',
    location: {
      latitude: 12.9141,
      longitude: 76.4587,
    },
    description: 'Home to the monolithic statue of Bahubali, standing 57 feet tall and carved from a single block of granite.',
    images: ['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1'],
    timings: '7:30 AM - 5:30 PM',
    distance: '8.7 km',
    rating: 4.9,
    reviews: 412,
    facilities: ['Parking', 'Restrooms', 'Guides', 'Souvenir Shop'],
    history: 'The statue was commissioned by Chavundaraya, a minister of the Ganga Dynasty, in 981 CE.',
    significance: 'One of the largest free-standing statues in the world and a major pilgrimage site.',
    events: [
      { name: 'Mahamastakabhisheka', date: 'Once every 12 years' },
      { name: 'Annual Festival', date: 'January 20-25' }
    ]
  }
];

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Mahavir Jayanti Celebration',
    location: 'Palitana Temples',
    date: '2025-04-14',
    time: '6:00 AM - 8:00 PM',
    description: 'Annual celebration of Lord Mahavir\'s birth with special prayers and ceremonies.',
    image: 'https://images.unsplash.com/photo-1609766418204-df8e0c218ba6',
    tirthId: '1'
  },
  {
    id: '2',
    name: 'Paryushan Parva',
    location: 'Ranakpur Temple',
    date: '2025-08-15',
    time: '7:00 AM - 9:00 PM',
    description: 'Eight-day festival of spiritual awakening and self-purification.',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1',
    tirthId: '2'
  },
  {
    id: '3',
    name: 'Diwali & New Year Celebration',
    location: 'Dilwara Temples',
    date: '2025-11-12',
    time: '5:00 AM - 10:00 PM',
    description: 'Special prayers and lighting ceremony to celebrate the Jain New Year.',
    image: 'https://images.unsplash.com/photo-1588096344356-9b02fafabe79',
    tirthId: '3'
  },
  {
    id: '4',
    name: 'Monthly Meditation Retreat',
    location: 'Dilwara Temples',
    date: '2024-06-05',
    time: '6:00 AM - 12:00 PM',
    description: 'A day of guided meditation and spiritual teachings.',
    image: 'https://images.unsplash.com/photo-1588096344356-9b02fafabe79',
    tirthId: '3'
  }
];

// Async thunks
export const fetchTirthsThunk = createAsyncThunk(
  'tirths/fetchTirths',
  async (_, { getState, rejectWithValue }) => {
    try {
      // For development, return mock data
      return { tirths: mockTirths, lastVisible: null };

      // In production, use this:
      /*
      const state = getState() as { tirths: TirthsState };
      const { lastVisible } = state.tirths;

      const result = await getAllTirths(lastVisible);
      return result;
      */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTirthsByTypeThunk = createAsyncThunk(
  'tirths/fetchTirthsByType',
  async (type: string, { rejectWithValue }) => {
    try {
      // For development, filter mock data
      return mockTirths.filter(tirth => tirth.type === type);

      // In production, use this:
      /*
      const tirths = await getTirthsByType(type);
      return tirths;
      */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTirthsNearLocationThunk = createAsyncThunk(
  'tirths/fetchTirthsNearLocation',
  async ({ latitude, longitude, radius }: { latitude: number; longitude: number; radius: number }, { rejectWithValue }) => {
    try {
      // For development, return mock data
      return mockTirths;

      // In production, use this:
      /*
      const tirths = await getTirthsNearLocation(latitude, longitude, radius);
      return tirths;
      */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTirthByIdThunk = createAsyncThunk(
  'tirths/fetchTirthById',
  async (id: string, { rejectWithValue }) => {
    try {
      // For development, find in mock data
      const tirth = mockTirths.find(t => t.id === id);
      if (!tirth) throw new Error('Tirth not found');
      return tirth;

      // In production, use this:
      /*
      const tirth = await getTirthById(id);
      return tirth;
      */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveRouteThunk = createAsyncThunk(
  'tirths/saveRoute',
  async (route: Omit<Route, 'id'>, { rejectWithValue }) => {
    try {
      // For development, just return with a mock ID
      return { ...route, id: Date.now().toString() };

      // In production, use this:
      /*
      const routeId = await saveRoute(route);
      return { ...route, id: routeId };
      */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserRoutesThunk = createAsyncThunk(
  'tirths/fetchUserRoutes',
  async (userId: string, { rejectWithValue }) => {
    try {
      // For development, return empty array
      return [];

      // In production, use this:
      /*
      const routes = await getUserRoutes(userId);
      return routes;
      */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRouteThunk = createAsyncThunk(
  'tirths/deleteRoute',
  async (routeId: string, { rejectWithValue }) => {
    try {
      // For development, just return the ID
      return routeId;

      // In production, use this:
      /*
      await deleteRoute(routeId);
      return routeId;
      */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventsThunk = createAsyncThunk(
  'tirths/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      // For development, filter mock events
      const today = new Date().toISOString().split('T')[0];
      const upcomingEvents = mockEvents.filter(event => event.date >= today);
      const pastEvents = mockEvents.filter(event => event.date < today);

      return { upcomingEvents, pastEvents };

      // In production, use this:
      /*
      const upcomingEvents = await getUpcomingEvents();
      const pastEvents = await getPastEvents();
      return { upcomingEvents, pastEvents };
      */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReviewThunk = createAsyncThunk(
  'tirths/addReview',
  async (review: Omit<Review, 'id' | 'date'>, { rejectWithValue }) => {
    try {
      // For development, just return with a mock ID
      return { ...review, id: Date.now().toString(), date: new Date() };

      // In production, use this:
      /*
      const reviewId = await addReview(review);
      return { ...review, id: reviewId };
      */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Load and save favorites from/to AsyncStorage
const loadFavoritesFromStorage = async () => {
  try {
    const favoritesJson = await AsyncStorage.getItem('favorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error loading favorites from storage:', error);
    return [];
  }
};

const saveFavoritesToStorage = async (favorites: string[]) => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to storage:', error);
  }
};

export const loadFavoritesThunk = createAsyncThunk(
  'tirths/loadFavorites',
  async (_, { rejectWithValue }) => {
    try {
      return await loadFavoritesFromStorage();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const tirthsSlice = createSlice({
  name: 'tirths',
  initialState,
  reducers: {
    setActiveRoute: (state, action: PayloadAction<any>) => {
      state.activeRoute = action.payload;
    },
    addTirthsAlongRoute: (state, action: PayloadAction<Tirth[]>) => {
      // Add tirths without duplicates
      const newTirths = action.payload.filter(
        newTirth => !state.tirths.some(tirth => tirth.id === newTirth.id)
      );
      state.tirths = [...state.tirths, ...newTirths];
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const tirthId = action.payload;
      if (state.favorites.includes(tirthId)) {
        state.favorites = state.favorites.filter(id => id !== tirthId);
      } else {
        state.favorites.push(tirthId);
       }
      // Save to AsyncStorage
      saveFavoritesToStorage(state.favorites);
    },
    updateFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearActiveRoute: (state) => {
      state.activeRoute = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tirths
      .addCase(fetchTirthsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTirthsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tirths = action.payload.tirths;
        state.lastVisible = action.payload.lastVisible;
        state.hasMore = action.payload.tirths.length > 0;
      })
      .addCase(fetchTirthsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch tirths by type
      .addCase(fetchTirthsByTypeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTirthsByTypeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tirths = action.payload;
      })
      .addCase(fetchTirthsByTypeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch tirths near location
      .addCase(fetchTirthsNearLocationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTirthsNearLocationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tirths = action.payload;
      })
      .addCase(fetchTirthsNearLocationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch events
      .addCase(fetchEventsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEvents = action.payload.upcomingEvents;
        state.pastEvents = action.payload.pastEvents;
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Load favorites
      .addCase(loadFavoritesThunk.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  }
});

export const {
  setActiveRoute,
  addTirthsAlongRoute,
  toggleFavorite,
  updateFilters,
  clearActiveRoute
} = tirthsSlice.actions;

export default tirthsSlice.reducer;