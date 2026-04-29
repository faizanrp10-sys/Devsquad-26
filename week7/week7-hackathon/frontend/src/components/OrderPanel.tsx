'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { RootState } from '@/store';
import { removeFromCart, updateQuantity, updateNote, setOrderType, clearCart } from '@/store/slices/cartSlice';
import { BACKEND_URL } from '@/store/services/api';
import PaymentModal from './PaymentModal';

const orderTypes = ['Dine In', 'To Go', 'Delivery'] as const;

export default function OrderPanel() {
  const dispatch = useDispatch();
  const { items, orderType, discount } = useSelector(
    (state: RootState) => state.cart,
  );
  const [paymentOpen, setPaymentOpen] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;

  return (
    <>
      <Box
        sx={{
          width: 380,
          minWidth: 380,
          bgcolor: '#1f1d2b',
          borderLeft: '1px solid #393c49',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: 1100,
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 600, mb: 2 }}>
            Orders #34562
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {orderTypes.map((type) => (
              <Chip
                key={type}
                label={type}
                onClick={() => dispatch(setOrderType(type))}
                sx={{
                  bgcolor:
                    orderType === type ? '#ea7c69' : 'transparent',
                  color: orderType === type ? '#fff' : '#abbbc2',
                  border:
                    orderType === type
                      ? '1px solid #ea7c69'
                      : '1px solid #393c49',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  px: 1,
                  '&:hover': {
                    bgcolor:
                      orderType === type
                        ? '#d4604f'
                        : 'rgba(234,124,105,0.12)',
                  },
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Column headers */}
        <Box
          sx={{
            display: 'flex',
            px: 3,
            py: 1,
            borderBottom: '1px solid #393c49',
          }}
        >
          <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>
            Item
          </Typography>
          <Typography
            variant="body2"
            sx={{ width: 50, textAlign: 'center', fontWeight: 600 }}
          >
            Qty
          </Typography>
          <Typography
            variant="body2"
            sx={{ width: 70, textAlign: 'right', fontWeight: 600 }}
          >
            Price
          </Typography>
        </Box>

        {/* Items */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
          {items.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                opacity: 0.4,
              }}
            >
              <Typography>No items in order</Typography>
            </Box>
          ) : (
            items.map((item) => (
              <Box key={item.productId} sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={item.productImage && item.productImage.startsWith('http') ? item.productImage : `${BACKEND_URL}${item.productImage || ''}`}
                    sx={{ width: 40, height: 40, borderRadius: '10px' }}
                    variant="rounded"
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      noWrap
                      sx={{ fontWeight: 500, color: '#fff' }}
                    >
                      {item.productName}
                    </Typography>
                    <Typography variant="body2">
                      $ {item.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 40,
                      border: '1px solid #393c49',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#2d303e',
                    }}
                  >
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          updateQuantity({
                            productId: item.productId,
                            quantity: parseInt(e.target.value) || 1,
                          }),
                        )
                      }
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        background: 'transparent',
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ width: 65, textAlign: 'right', fontWeight: 500 }}
                  >
                    $ {(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
                {/* Note field */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 1,
                    gap: 1,
                  }}
                >
                  <TextField
                    placeholder="Order Note..."
                    size="small"
                    fullWidth
                    value={item.note}
                    onChange={(e) =>
                      dispatch(
                        updateNote({
                          productId: item.productId,
                          note: e.target.value,
                        }),
                      )
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '0.75rem',
                        height: 36,
                        bgcolor: '#2d303e',
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    sx={{
                      color: '#ea7c69',
                      border: '1px solid #ea7c69',
                      borderRadius: '10px',
                      width: 36,
                      height: 36,
                      '&:hover': { bgcolor: 'rgba(234,124,105,0.15)' },
                    }}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Divider sx={{ mt: 1.5, borderColor: '#393c49' }} />
              </Box>
            ))
          )}
        </Box>

        {/* Footer totals */}
        <Box sx={{ p: 3, borderTop: '1px solid #393c49' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" sx={{ color: '#abbbc2' }}>
              Discount
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              ${discount.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" sx={{ color: '#abbbc2' }}>
              Sub total
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              $ {total.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            disabled={items.length === 0}
            onClick={() => setPaymentOpen(true)}
            sx={{
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '12px',
            }}
          >
            Continue to Payment
          </Button>
        </Box>
      </Box>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
      />
    </>
  );
}
