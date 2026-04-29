'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar, { SIDEBAR_WIDTH } from '@/components/Sidebar';
import OrderPanel from '@/components/OrderPanel';
import { useGetProductsQuery } from '@/store/services/productsApi';
import { BACKEND_URL } from '@/store/services/api';
import { addToCart } from '@/store/slices/cartSlice';

const ORDER_PANEL_WIDTH = 380;
const categories = [
  'Hot Dishes',
  'Cold Dishes',
  'Soup',
  'Grill',
  'Appetizer',
  'Dessert',
];

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState('Hot Dishes');
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const { data: products, isLoading } = useGetProductsQuery();

  const filteredProducts = (products || []).filter((p) => {
    const matchesCategory = p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#252836' }}>
      <Sidebar />

      {/* Main content */}
      <Box
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          mr: `${ORDER_PANEL_WIDTH}px`,
          flex: 1,
          p: 3,
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
              Jaegar Resto
            </Typography>
            <Typography variant="body2">{dateStr}</Typography>
          </Box>
          <TextField
            placeholder="Search for food, coffee, etc..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 320 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#ea7c69' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Category Tabs */}
        <Tabs
          value={activeCategory}
          onChange={(_, v) => setActiveCategory(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              color: '#abbbc2',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              minWidth: 'auto',
              px: 2,
            },
            '& .Mui-selected': {
              color: '#ea7c69 !important',
              fontWeight: 700,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#ea7c69',
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          {categories.map((cat) => (
            <Tab key={cat} label={cat} value={cat} />
          ))}
        </Tabs>

        {/* Section Title */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 600 }}>
            Choose Dishes
          </Typography>
          <Chip
            label={`▼ Dine In`}
            sx={{
              bgcolor: '#2d303e',
              color: '#fff',
              border: '1px solid #393c49',
              fontWeight: 500,
            }}
          />
        </Box>

        {/* Product Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 2.5,
          }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card
                  key={i}
                  sx={{
                    bgcolor: '#1f1d2b',
                    borderRadius: '16px',
                    textAlign: 'center',
                    pt: 5,
                    pb: 2,
                    position: 'relative',
                    border: '1px solid #393c49',
                  }}
                >
                  <Skeleton
                    variant="circular"
                    width={120}
                    height={120}
                    sx={{ mx: 'auto', mb: 2, bgcolor: '#393c49' }}
                  />
                  <Skeleton
                    width="60%"
                    sx={{ mx: 'auto', mb: 1, bgcolor: '#393c49' }}
                  />
                  <Skeleton
                    width="30%"
                    sx={{ mx: 'auto', bgcolor: '#393c49' }}
                  />
                </Card>
              ))
            : filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  onClick={() =>
                    dispatch(
                      addToCart({
                        productId: product._id,
                        productName: product.name,
                        productImage: product.image,
                        price: product.price,
                      }),
                    )
                  }
                  sx={{
                    bgcolor: '#1f1d2b',
                    borderRadius: '16px',
                    textAlign: 'center',
                    pt: 5,
                    pb: 2,
                    px: 1.5,
                    position: 'relative',
                    border: '1px solid #393c49',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: '#ea7c69',
                      boxShadow: '0 8px 25px rgba(234,124,105,0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.image && product.image.startsWith('http') ? product.image : `${BACKEND_URL}${product.image || ''}`}
                      alt={product.name}
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #252836',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ pt: 8, pb: '8px !important' }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: '#fff',
                        mb: 0.5,
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#abbbc2', mb: 0.5 }}
                    >
                      $ {(product.price || 0).toFixed(2)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          product.availableQuantity <= 5
                            ? '#ff7ca3'
                            : '#abbbc2',
                        fontWeight:
                          product.availableQuantity <= 5 ? 600 : 400,
                      }}
                    >
                      {product.availableQuantity} Bowls available
                    </Typography>
                  </CardContent>
                </Card>
              ))}
        </Box>

        {!isLoading && filteredProducts.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              opacity: 0.5,
            }}
          >
            <Typography variant="h3">No dishes found</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Try a different category or search term
            </Typography>
          </Box>
        )}
      </Box>

      {/* Order Panel */}
      <OrderPanel />
    </Box>
  );
}
