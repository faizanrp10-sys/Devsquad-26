import { apiSlice } from './api';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  note?: string;
  total?: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  orderType: 'Dine In' | 'To Go' | 'Delivery';
  status: 'Pending' | 'Preparing' | 'Completed' | 'Cancelled';
  paymentMethod: 'Credit Card' | 'Paypal' | 'Cash';
  tableNo?: string;
  customerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  discount?: number;
  orderType: string;
  paymentMethod: string;
  tableNo?: string;
  customerName?: string;
}

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], string | void>({
      query: (status) =>
        status ? `/orders?status=${status}` : '/orders',
      providesTags: ['Orders'],
    }),
    getRecentOrders: builder.query<Order[], number | void>({
      query: (limit) => `/orders/recent?limit=${limit || 10}`,
      providesTags: ['Orders'],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Orders'],
    }),
    createOrder: builder.mutation<Order, CreateOrderPayload>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Orders', 'Products', 'RawMaterials', 'Dashboard'],
    }),
    updateOrderStatus: builder.mutation<Order, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders', 'Dashboard'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetRecentOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi;
