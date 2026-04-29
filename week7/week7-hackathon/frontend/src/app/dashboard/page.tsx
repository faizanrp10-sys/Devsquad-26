'use client';
import React from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import Sidebar, { SIDEBAR_WIDTH } from '@/components/Sidebar';
import { useGetDashboardStatsQuery } from '@/store/services/dashboardApi';
import { useUpdateOrderStatusMutation } from '@/store/services/ordersApi';
import { BACKEND_URL } from '@/store/services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const statusColors: Record<string, string> = {
  Completed: '#50d1aa', Preparing: '#ffb572', Pending: '#ff7ca3', Cancelled: '#9288e0',
};
const pieColors = ['#ff7ca3', '#ffb572', '#65b0f6'];

export default function DashboardPage() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  const kpiCards = [
    { label: 'Total Revenue', value: stats ? `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0', change: '+32.40%', up: true, icon: <AttachMoneyIcon />, iconBg: '#65b0f6' },
    { label: 'Total Dish Ordered', value: stats ? stats.totalDishesOrdered.toLocaleString() : '0', change: '-12.40%', up: false, icon: <RestaurantIcon />, iconBg: '#ffb572' },
    { label: 'Total Customer', value: stats ? stats.totalCustomers.toLocaleString() : '0', change: '+2.40%', up: true, icon: <PeopleIcon />, iconBg: '#50d1aa' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#252836' }}>
      <Sidebar />
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, flex: 1, display: 'flex', gap: 2.5, p: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h1" sx={{ fontWeight: 700, mb: 0.5 }}>Dashboard</Typography>
            <Typography variant="body2">{today}</Typography>
          </Box>

          {/* KPI Cards */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {kpiCards.map((kpi) => (
              <Card key={kpi.label} sx={{ flex: 1, bgcolor: '#1f1d2b', borderRadius: '16px', border: '1px solid #393c49', '&:hover': { transform: 'translateY(-2px)' }, transition: 'transform 0.2s' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: `${kpi.iconBg}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.iconBg }}>{kpi.icon}</Box>
                    <Chip icon={kpi.up ? <TrendingUpIcon sx={{ fontSize: 16, color: '#50d1aa !important' }} /> : <TrendingDownIcon sx={{ fontSize: 16, color: '#ff7ca3 !important' }} />} label={kpi.change} size="small" sx={{ bgcolor: 'transparent', color: kpi.up ? '#50d1aa' : '#ff7ca3', fontWeight: 600, fontSize: '0.7rem' }} />
                  </Box>
                  {isLoading ? <Skeleton width="60%" height={36} sx={{ bgcolor: '#393c49' }} /> : <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '1.75rem', mb: 0.5 }}>{kpi.value}</Typography>}
                  <Typography variant="body2">{kpi.label}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Order Report Table */}
          <Card sx={{ bgcolor: '#1f1d2b', borderRadius: '16px', border: '1px solid #393c49' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h2" sx={{ fontWeight: 600 }}>Order Report</Typography>
                <Chip label="⚙ Filter Order" sx={{ bgcolor: '#2d303e', color: '#fff', border: '1px solid #393c49' }} />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {['Customer', 'Menu', 'Total Payment', 'Status', 'Action'].map((h) => (
                        <TableCell key={h} sx={{ color: '#abbbc2', borderColor: '#393c49', fontWeight: 600 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>{Array.from({ length: 5 }).map((_, j) => (<TableCell key={j} sx={{ borderColor: '#393c49' }}><Skeleton sx={{ bgcolor: '#393c49' }} /></TableCell>))}</TableRow>
                    )) : (stats?.recentOrders || []).map((order) => (
                      <TableRow key={order._id} sx={{ '&:hover': { bgcolor: 'rgba(234,124,105,0.04)' }, transition: 'background 0.2s' }}>
                        <TableCell sx={{ borderColor: '#393c49' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 34, height: 34, bgcolor: '#ea7c69', fontSize: '0.8rem' }}>{(order.customerName || 'G')[0].toUpperCase()}</Avatar>
                            <Typography variant="body1">{order.customerName || 'Guest'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderColor: '#393c49', color: '#fff' }}>{order.items.map((i) => i.productName).join(', ').substring(0, 35)}</TableCell>
                        <TableCell sx={{ borderColor: '#393c49', color: '#fff' }}>${(order.total || 0).toFixed(2)}</TableCell>
                        <TableCell sx={{ borderColor: '#393c49' }}>
                          <Chip label={order.status} size="small" sx={{ bgcolor: `${statusColors[order.status] || '#abbbc2'}22`, color: statusColors[order.status] || '#abbbc2', fontWeight: 600, fontSize: '0.7rem' }} />
                        </TableCell>
                        <TableCell sx={{ borderColor: '#393c49' }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                              <>
                                <Button
                                  size="small"
                                  startIcon={<CheckCircleIcon />}
                                  onClick={() => handleUpdateStatus(order._id, 'Completed')}
                                  sx={{ color: '#50d1aa', textTransform: 'none', minWidth: 'auto', p: 0.5 }}
                                >
                                  Done
                                </Button>
                                <Button
                                  size="small"
                                  startIcon={<CancelIcon />}
                                  onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                                  sx={{ color: '#ff7ca3', textTransform: 'none', minWidth: 'auto', p: 0.5 }}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Right sidebar */}
        <Box sx={{ width: 320, minWidth: 320 }}>
          {/* Low Stock Alerts */}
          {(stats?.lowStockMaterials || []).length > 0 && (
            <Card sx={{ bgcolor: '#1f1d2b', borderRadius: '16px', border: '1px solid #ff7ca3', mb: 2.5 }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#ff7ca3', mb: 2 }}>Low Stock Alerts</Typography>
                {stats?.lowStockMaterials.map((m) => (
                  <Box key={m._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{m.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#ff7ca3' }}>Only {m.stock} {m.unit} left</Typography>
                    </Box>
                    <Chip label="Refill" size="small" sx={{ bgcolor: '#ff7ca322', color: '#ff7ca3', fontWeight: 600 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          <Card sx={{ bgcolor: '#1f1d2b', borderRadius: '16px', border: '1px solid #393c49', mb: 2.5 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>Most Ordered</Typography>
                <Chip label="▼ Today" size="small" sx={{ bgcolor: '#2d303e', color: '#fff', border: '1px solid #393c49' }} />
              </Box>
              {(stats?.mostOrdered || []).map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar src={item.image && item.image.startsWith('http') ? item.image : `${BACKEND_URL}${item.image || ''}`} sx={{ width: 44, height: 44, borderRadius: '10px' }} variant="rounded" />
                  <Box><Typography variant="body1" sx={{ fontWeight: 500 }}>{item.name}</Typography><Typography variant="body2">{item.totalOrdered} dishes ordered</Typography></Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#1f1d2b', borderRadius: '16px', border: '1px solid #393c49' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>Most Type of Order</Typography>
                <Chip label="▼ Today" size="small" sx={{ bgcolor: '#2d303e', color: '#fff', border: '1px solid #393c49' }} />
              </Box>
              {!isLoading && stats?.orderTypeBreakdown && (
                <>
                  <Box sx={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={stats.orderTypeBreakdown} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={50} outerRadius={75} strokeWidth={3} stroke="#1f1d2b">{stats.orderTypeBreakdown.map((_, index) => (<Cell key={index} fill={pieColors[index % pieColors.length]} />))}</Pie><Tooltip contentStyle={{ background: '#252836', border: '1px solid #393c49', borderRadius: 8, color: '#fff' }} /></PieChart>
                    </ResponsiveContainer>
                  </Box>
                  {stats.orderTypeBreakdown.map((item, idx) => (
                    <Box key={item.type} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: pieColors[idx % pieColors.length] }} />
                      <Typography variant="body1" sx={{ flex: 1 }}>{item.type}</Typography>
                      <Typography variant="body2">{item.count} customers</Typography>
                    </Box>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
