import { apiSlice } from './api';

export interface RawMaterial {
  _id: string;
  name: string;
  unit: string;
  stock: number;
  minLevel: number;
  createdAt: string;
  updatedAt: string;
}

export const rawMaterialsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRawMaterials: builder.query<RawMaterial[], void>({
      query: () => '/raw-materials',
      providesTags: ['RawMaterials'],
    }),
    getLowStock: builder.query<RawMaterial[], void>({
      query: () => '/raw-materials/low-stock',
      providesTags: ['RawMaterials'],
    }),
    getRawMaterial: builder.query<RawMaterial, string>({
      query: (id) => `/raw-materials/${id}`,
      providesTags: ['RawMaterials'],
    }),
    createRawMaterial: builder.mutation<RawMaterial, Partial<RawMaterial>>({
      query: (body) => ({ url: '/raw-materials', method: 'POST', body }),
      invalidatesTags: ['RawMaterials', 'Products'],
    }),
    updateRawMaterial: builder.mutation<RawMaterial, { id: string; data: Partial<RawMaterial> }>({
      query: ({ id, data }) => ({ url: `/raw-materials/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['RawMaterials', 'Products'],
    }),
    deleteRawMaterial: builder.mutation<void, string>({
      query: (id) => ({ url: `/raw-materials/${id}`, method: 'DELETE' }),
      invalidatesTags: ['RawMaterials', 'Products'],
    }),
  }),
});

export const {
  useGetRawMaterialsQuery,
  useGetLowStockQuery,
  useGetRawMaterialQuery,
  useCreateRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useDeleteRawMaterialMutation,
} = rawMaterialsApi;
