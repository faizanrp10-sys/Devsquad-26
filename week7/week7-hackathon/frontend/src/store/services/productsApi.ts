import { apiSlice } from './api';

export interface RecipeItem {
  materialId: string;
  quantity: number;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  recipe: RecipeItem[];
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], string | void>({
      query: (category) =>
        category ? `/products?category=${encodeURIComponent(category)}` : '/products',
      providesTags: ['Products'],
    }),
    getCategories: builder.query<string[], void>({
      query: () => '/products/categories',
      providesTags: ['Products'],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<Product, { id: string; data: Partial<Product> }>({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
