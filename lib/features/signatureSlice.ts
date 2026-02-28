import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// This matches your Prisma model fields
interface Signature {
  id: number;
  name: string;
  email: string;
  mobile: string;
  idnumber: string;
  county: string;
  constituency: string;
  ward: string;
  signature: string | null;
  createdAt: string; // Dates are passed as strings from Server Actions
}

interface SignatureState {
  items: Signature[];
  filteredItems: Signature[];
  totalCount: number;
}

const initialState: SignatureState = {
  items: [],
  filteredItems: [],
  totalCount: 0,
};

export const signatureSlice = createSlice({
  name: 'signatures',
  initialState,
  reducers: {
    setSignatures: (state, action: PayloadAction<Signature[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
      state.totalCount = action.payload.length;
    },
    filterSignatures: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      state.filteredItems = state.items.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.idnumber.includes(query) ||
        item.county.toLowerCase().includes(query)
      );
    },
  },
});

export const { setSignatures, filterSignatures } = signatureSlice.actions;
export default signatureSlice.reducer;