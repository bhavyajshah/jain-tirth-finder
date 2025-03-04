import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TirthLocation {
  latitude: number;
  longitude: number;
}

interface Tirth {
  id: string;
  name: string;
  type: string;
  location: TirthLocation;
  description: string;
  images: string[];
  timings: string;
  distance: string;
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
}

interface RoutePoint {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface Route {
  origin: RoutePoint;
  destination: RoutePoint;
}

interface TirthsState {
  tirths: Tirth[];
  activeRoute: Route | null;
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
}

const initialState: TirthsState = {
  tirths: [
    {
      id: '1',
      name: 'Palitana Temples',
      type: 'Shwetambar',
      location: {
        latitude: 21.4859,
        longitude: 71.8496,
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
        latitude: 25.1162,
        longitude: 73.4872,
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
        latitude: 24.6167,
        longitude: 72.7167,
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
  ],
  activeRoute: null,
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
};

export const tirthsSlice = createSlice({
  name: 'tirths',
  initialState,
  reducers: {
    addTirthsAlongRoute: (state, action: PayloadAction<Tirth[]>) => {
      // Filter out duplicates by ID
      const newTirths = action.payload.filter(
        newTirth => !state.tirths.some(existingTirth => existingTirth.id === newTirth.id)
      );
      state.tirths = [...state.tirths, ...newTirths];
    },
    setActiveRoute: (state, action: PayloadAction<Route>) => {
      state.activeRoute = action.payload;
    },
    clearActiveRoute: (state) => {
      state.activeRoute = null;
    },
    updateFilters: (state, action: PayloadAction<Partial<TirthsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const tirthId = action.payload;
      if (state.favorites.includes(tirthId)) {
        state.favorites = state.favorites.filter(id => id !== tirthId);
      } else {
        state.favorites.push(tirthId);
      }
    },
    addTirthRating: (state, action: PayloadAction<{id: string, rating: number}>) => {
      const { id, rating } = action.payload;
      const tirth = state.tirths.find(t => t.id === id);
      if (tirth) {
        // In a real app, we would calculate the new average rating
        // For this demo, we'll just update the rating directly
        tirth.rating = (tirth.rating || 0) * 0.9 + rating * 0.1;
        tirth.reviews = (tirth.reviews || 0) + 1;
      }
    }
  },
});

export const { 
  addTirthsAlongRoute, 
  setActiveRoute, 
  clearActiveRoute,
  updateFilters,
  toggleFavorite,
  addTirthRating
} = tirthsSlice.actions;

export default tirthsSlice.reducer;