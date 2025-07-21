import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
}

export const registerUser = createAsyncThunk('/auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData, {
        withCredentials: true
      })
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { success: false, message: 'Registration failed' });
    }
  }
)

export const loginUser = createAsyncThunk('/auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData, {
        withCredentials: true
      })
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { success: false, message: 'Login failed' });
    }
  }
)

export const logoutUser = createAsyncThunk('/auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, {
        withCredentials: true
      })
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { success: false, message: 'Logout failed' });
    }
  }
)

export const checkAuthStatus = createAsyncThunk('/auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`, {
        withCredentials: true
      })
      return response.data;
    } catch (error) {
      // Don't treat 401 as an error - it just means user is not logged in
      if (error.response?.status === 401) {
        return rejectWithValue({ success: false, message: 'Not authenticated' });
      }
      return rejectWithValue(error.response?.data || { success: false, message: 'Network error' });
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        console.error('Registration error:', action.payload);
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        console.error('Login error:', action.payload);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success ? true : false;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        console.error('Auth check error:', action.payload);
      })
  }
})

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;