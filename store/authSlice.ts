import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  registerUser, 
  signIn, 
  signOut, 
  getUserProfile, 
  updateUserPreferences 
} from '../firebase/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserPreferences {
  notifications: boolean;
  darkMode: boolean;
  locationServices: boolean;
  offlineMode: boolean;
  autoCheckIn: boolean;
  language: string;
}

interface UserState {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  preferences: UserPreferences;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  uid: null,
  email: null,
  displayName: null,
  preferences: {
    notifications: true,
    darkMode: false,
    locationServices: true,
    offlineMode: false,
    autoCheckIn: false,
    language: 'en'
  },
  isAuthenticated: false,
  loading: false,
  error: null
};

// Async thunks
export const registerUserThunk = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }, { rejectWithValue }) => {
    try {
      const user = await registerUser(email, password, displayName);
      const userProfile = await getUserProfile(user.uid);
      
      // Save auth state to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        preferences: userProfile.preferences
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInThunk = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signIn(email, password);
      const user = userCredential.user;
      const userProfile = await getUserProfile(user.uid);
      
      // Save auth state to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        preferences: userProfile.preferences
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutThunk = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await signOut();
      await AsyncStorage.removeItem('user');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        const userProfile = await getUserProfile(user.uid);
        
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          preferences: userProfile.preferences
        };
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePreferencesThunk = createAsyncThunk(
  'auth/updatePreferences',
  async ({ userId, preferences }: { userId: string; preferences: UserPreferences }, { rejectWithValue }) => {
    try {
      await updateUserPreferences(userId, preferences);
      return preferences;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePreference: (state, action: PayloadAction<{ key: keyof UserPreferences; value: any }>) => {
      const { key, value } = action.payload;
      state.preferences[key] = value;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.displayName = action.payload.displayName;
        state.preferences = action.payload.preferences;
        state.isAuthenticated = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Sign in
      .addCase(signInThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.displayName = action.payload.displayName;
        state.preferences = action.payload.preferences;
        state.isAuthenticated = true;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Sign out
      .addCase(signOutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.loading = false;
        state.uid = null;
        state.email = null;
        state.displayName = null;
        state.isAuthenticated = false;
        state.preferences = initialState.preferences;
      })
      .addCase(signOutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Load user from storage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.uid = action.payload.uid;
          state.email = action.payload.email;
          state.displayName = action.payload.displayName;
          state.preferences = action.payload.preferences;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update preferences
      .addCase(updatePreferencesThunk.fulfilled, (state, action) => {
        state.preferences = action.payload;
      });
  }
});

export const { clearError, updatePreference } = authSlice.actions;
export default authSlice.reducer;