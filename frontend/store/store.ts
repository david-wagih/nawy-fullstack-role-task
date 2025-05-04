import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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

export const createApartment = createAsyncThunk<Apartment, Partial<Apartment>>(
  'apartments/create',
  async (apartment) => {
    const res = await fetch(`${BASE_URL}/apartments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apartment),
    });
    const data = await res.json();
    return data.data;
  }
);

export const updateApartment = createAsyncThunk<Apartment, { id: string; updates: Partial<Apartment> }>(
  'apartments/update',
  async ({ id, updates }) => {
    const res = await fetch(`${BASE_URL}/apartments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.data;
  }
);

export const deleteApartment = createAsyncThunk<string, string>(
  'apartments/delete',
  async (id) => {
    await fetch(`${BASE_URL}/apartments/${id}`, { method: 'DELETE' });
    return id;
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
      })
      .addCase(createApartment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateApartment.fulfilled, (state, action) => {
        const idx = state.items.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteApartment.fulfilled, (state, action) => {
        state.items = state.items.filter(a => a.id !== action.payload);
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