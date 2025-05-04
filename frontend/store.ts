import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const fetchApartments = createAsyncThunk<Apartment[]>(
  'apartments/fetchAll',
  async () => {
    const res = await fetch(`${BASE_URL}/apartments`);
    const data = await res.json();
    return data.data || [];
  }
);

const apartmentsSlice = createSlice({
  name: 'apartments',
  initialState: {
    items: [] as Apartment[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchApartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch apartments';
      });
  },
});

export const store = configureStore({
  reducer: {
    apartments: apartmentsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const selectApartments = (state: RootState) => state.apartments.items;
export const selectApartmentsLoading = (state: RootState) => state.apartments.loading;
export const selectApartmentsError = (state: RootState) => state.apartments.error; 