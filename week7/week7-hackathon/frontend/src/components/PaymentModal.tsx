'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Divider,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoneyIcon from '@mui/icons-material/Money';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RootState } from '@/store';
import { clearCart, setTableNo, setCustomerName } from '@/store/slices/cartSlice';
import { useCreateOrderMutation } from '@/store/services/ordersApi';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
}

const paymentMethods = [
  { key: 'Credit Card', icon: <CreditCardIcon />, label: 'Credit Card' },
  { key: 'Paypal', icon: <AccountBalanceWalletIcon />, label: 'Paypal' },
  { key: 'Cash', icon: <MoneyIcon />, label: 'Cash' },
] as const;

export default function PaymentModal({ open, onClose }: PaymentModalProps) {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const [selectedPayment, setSelectedPayment] = useState<string>('Credit Card');
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal - cart.discount;

  const handleConfirm = async () => {
    try {
      await createOrder({
        items: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          price: item.price,
          quantity: item.quantity,
          note: item.note,
        })),
        discount: cart.discount,
        orderType: cart.orderType,
        paymentMethod: selectedPayment,
        tableNo: cart.tableNo,
        customerName: cart.customerName,
      }).unwrap();

      setSnackbar({
        open: true,
        message: 'Order placed successfully!',
        severity: 'success',
      });
      dispatch(clearCart());
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setSnackbar({
        open: true,
        message: error?.data?.message || 'Failed to place order',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#252836',
              borderRadius: '16px',
              width: 800,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'row',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Left — Confirmation */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            borderRight: '1px solid #393c49',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton onClick={onClose} sx={{ color: '#fff' }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                Confirmation
              </Typography>
              <Typography variant="body2">Orders #34562</Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {cart.items.map((item) => (
              <Box key={item.productId} sx={{ mb: 2 }}>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}
                >
                  <Avatar
                    src={item.productImage}
                    sx={{ width: 40, height: 40, borderRadius: '10px' }}
                    variant="rounded"
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" noWrap sx={{ fontWeight: 500 }}>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2">
                      $ {item.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '10px',
                      border: '1px solid #393c49',
                      bgcolor: '#2d303e',
                    }}
                  >
                    <Typography variant="body1">{item.quantity}</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, minWidth: 65, textAlign: 'right' }}>
                    $ {(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
                {item.note && (
                  <Box
                    sx={{
                      ml: 7,
                      p: 1,
                      borderRadius: '8px',
                      bgcolor: '#2d303e',
                      border: '1px solid #393c49',
                    }}
                  >
                    <Typography variant="body2">{item.note}</Typography>
                  </Box>
                )}
                <IconButton
                  size="small"
                  sx={{
                    ml: 'auto',
                    display: 'block',
                    color: '#ea7c69',
                    float: 'right',
                    mt: -5,
                  }}
                >
                  <AddIcon />
                </IconButton>
                <Divider sx={{ mt: 1, borderColor: '#393c49' }} />
              </Box>
            ))}
          </Box>

          <Box sx={{ pt: 2, borderTop: '1px solid #393c49' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" sx={{ color: '#abbbc2' }}>
                Discount
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                ${cart.discount.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" sx={{ color: '#abbbc2' }}>
                Sub total
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                $ {total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right — Payment */}
        <Box sx={{ width: 340, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Payment
          </Typography>
          <Typography variant="body2" sx={{ mb: 2.5, color: '#abbbc2' }}>
            3 payment methods available
          </Typography>

          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            Payment Method
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {paymentMethods.map((pm) => (
              <Box
                key={pm.key}
                onClick={() => setSelectedPayment(pm.key)}
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: '10px',
                  border:
                    selectedPayment === pm.key
                      ? '1px solid #ea7c69'
                      : '1px solid #393c49',
                  bgcolor: '#1f1d2b',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#ea7c69' },
                }}
              >
                {selectedPayment === pm.key && (
                  <CheckCircleIcon sx={{ 
                    position: 'absolute', 
                    top: 4, 
                    right: 4, 
                    fontSize: 16, 
                    color: '#ea7c69' 
                  }} />
                )}
                <Box sx={{ color: selectedPayment === pm.key ? '#ea7c69' : '#abbbc2', mb: 0.5 }}>
                  {pm.icon}
                </Box>
                <Typography variant="caption" sx={{ color: selectedPayment === pm.key ? '#fff' : '#abbbc2', fontWeight: 600 }}>
                  {pm.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <TextField
              label="Order Type"
              size="small"
              fullWidth
              value={cart.orderType}
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              label="Table no."
              placeholder="140"
              size="small"
              fullWidth
              value={cart.tableNo}
              onChange={(e) => dispatch(setTableNo(e.target.value))}
            />
          </Box>

          {selectedPayment === 'Credit Card' && (
            <Box sx={{ mt: 1 }}>
              <TextField
                label="Cardholder Name"
                placeholder="Levi Ackerman"
                size="small"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Card Number"
                placeholder="2564 1421 0897 1244"
                size="small"
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                <TextField
                  label="Expiration Date"
                  placeholder="02/2022"
                  size="small"
                  fullWidth
                />
                <TextField
                  label="CVV"
                  placeholder="***"
                  type="password"
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>
          )}

          <TextField
            label="Customer Name"
            placeholder="Enter customer name"
            size="small"
            fullWidth
            sx={{ mb: 1 }}
            value={cart.customerName}
            onChange={(e) => dispatch(setCustomerName(e.target.value))}
          />

          <Box sx={{ mt: 'auto', display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              sx={{
                py: 1.5,
                color: '#ea7c69',
                borderColor: '#ea7c69',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#d4604f',
                  bgcolor: 'rgba(234,124,105,0.08)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleConfirm}
              disabled={isLoading || cart.items.length === 0}
              sx={{ 
                py: 1.5, 
                bgcolor: '#ea7c69', 
                color: '#fff', 
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 8px 20px rgba(234,124,105,0.3)',
                '&:hover': { bgcolor: '#d4604f' }
              }}
            >
              {isLoading ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: '10px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
