import { apiSlice } from './api';

export interface DashboardStats {
  totalRevenue: number;
  totalDishesOrdered: number;
  totalCustomers: number;
  mostOrdered: {
    name: string;
    totalOrdered: number;
    image: string;
  }[];
  orderTypeBreakdown: {
    type: string;
    count: number;
  }[];
  recentOrders: {
    _id: string;
    orderNumber: string;
    items: { productName: string; quantity: number }[];
    total: number;
    status: string;
    orderType: string;
    customerName?: string;
    createdAt: string;
  }[];
  lowStockMaterials: {
    _id: string;
    name: string;
    stock: number;
    unit: string;
    minLevel: number;
  }[];
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
