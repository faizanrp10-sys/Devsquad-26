import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace('/api', '');

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  }),
  tagTypes: ['RawMaterials', 'Products', 'Orders', 'Dashboard'],
  endpoints: () => ({}),
});
