import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL as BASE_URL } from '../lib/axios';

const API_URL = `${BASE_URL}/cars`;

interface CarState {
  cars: any[];
  currentCar: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: CarState = {
  cars: [],
  currentCar: null,
  loading: false,
  error: null,
};

export const fetchCars = createAsyncThunk('cars/fetchCars', async (filters: any = {}) => {
  const response = await axios.get(API_URL, { params: filters });
  return response.data;
});

export const fetchCarById = createAsyncThunk('cars/fetchCarById', async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
});

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCurrentCar: (state, action) => {
      state.currentCar = action.payload;
    },
    updateCarStatus: (state, action) => {
      if (state.currentCar && state.currentCar._id === action.payload.carId) {
        state.currentCar = { ...state.currentCar, ...action.payload };
      }
      state.cars = state.cars.map(car => 
        car._id === action.payload.carId ? { ...car, ...action.payload } : car
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cars';
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.currentCar = action.payload;
      });
  },
});

export const { setCurrentCar, updateCarStatus } = carSlice.actions;
export default carSlice.reducer;
