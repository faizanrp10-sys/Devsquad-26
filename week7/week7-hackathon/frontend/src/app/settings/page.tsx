'use client';
import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, CardMedia, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Chip, Snackbar, Alert, MenuItem, Select, FormControl, InputLabel, List, ListItem, ListItemText, ListItemSecondaryAction,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar, { SIDEBAR_WIDTH } from '@/components/Sidebar';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '@/store/services/productsApi';
import { useGetRawMaterialsQuery } from '@/store/services/rawMaterialsApi';
import { BACKEND_URL } from '@/store/services/api';

const categories = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];
const emptyForm = { name: '', price: 0, image: '', category: 'Hot Dishes', recipe: [] as { materialId: string; quantity: number }[] };

export default function SettingsPage() {
  const { data: products = [] } = useGetProductsQuery();
  const { data: materials = [] } = useGetRawMaterialsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [activeTab, setActiveTab] = useState('Hot Dishes');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [recipeMaterialId, setRecipeMaterialId] = useState('');
  const [recipeQty, setRecipeQty] = useState(0);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const filtered = products.filter((p) => p.category === activeTab);

  const handleOpen = (product?: typeof products[0]) => {
    if (product) {
      setEditingId(product._id);
      setForm({ name: product.name, price: product.price, image: product.image, category: product.category, recipe: product.recipe.map((r) => ({ materialId: r.materialId, quantity: r.quantity })) });
    } else { setEditingId(null); setForm(emptyForm); }
    setDialogOpen(true);
  };

  const addRecipeItem = () => {
    if (!recipeMaterialId || recipeQty <= 0) return;
    setForm({ ...form, recipe: [...form.recipe, { materialId: recipeMaterialId, quantity: recipeQty }] });
    setRecipeMaterialId(''); setRecipeQty(0);
  };

  const removeRecipeItem = (idx: number) => { setForm({ ...form, recipe: form.recipe.filter((_, i) => i !== idx) }); };

  const handleSave = async () => {
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) await updateProduct({ id: editingId, data: payload }).unwrap();
      else await createProduct(payload).unwrap();
      setSnack({ open: true, message: editingId ? 'Product updated' : 'Product created', severity: 'success' });
      setDialogOpen(false);
    } catch { setSnack({ open: true, message: 'Failed to save', severity: 'error' }); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteProduct(id).unwrap(); setSnack({ open: true, message: 'Product deleted', severity: 'success' }); }
    catch { setSnack({ open: true, message: 'Failed to delete', severity: 'error' }); }
  };

  const getMaterialName = (id: string) => materials.find((m) => m._id === id)?.name || id;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#252836' }}>
      <Sidebar />
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, flex: 1, p: 3 }}>
        <Typography variant="h1" sx={{ fontWeight: 700, mb: 3 }}>Settings</Typography>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left nav */}
          <Card sx={{ width: 260, bgcolor: '#1f1d2b', borderRadius: '16px', border: '1px solid #393c49', alignSelf: 'flex-start' }}>
            <CardContent sx={{ p: 0 }}>
              {[{ label: 'Products Management', sub: 'Manage your product, pricing, etc', active: true }, { label: 'Appearance', sub: 'Dark and Light mode, Font size', active: false }, { label: 'Your Restaurant', sub: 'Dark and Light mode, Font size', active: false }].map((item) => (
                <Box key={item.label} sx={{ p: 2, borderLeft: item.active ? '3px solid #ea7c69' : '3px solid transparent', bgcolor: item.active ? 'rgba(234,124,105,0.08)' : 'transparent', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(234,124,105,0.05)' } }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: item.active ? '#ea7c69' : '#fff' }}>{item.label}</Typography>
                  <Typography variant="body2">{item.sub}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Right content */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h2" sx={{ fontWeight: 600 }}>Products Management</Typography>
              <Button variant="outlined" sx={{ color: '#ea7c69', borderColor: '#ea7c69' }}>⚙ Manage Categories</Button>
            </Box>

            {/* Category Tabs */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, borderBottom: '1px solid #393c49', pb: 1 }}>
              {categories.map((cat) => (
                <Typography key={cat} onClick={() => setActiveTab(cat)} sx={{ px: 2, py: 0.5, cursor: 'pointer', fontWeight: activeTab === cat ? 700 : 400, color: activeTab === cat ? '#ea7c69' : '#abbbc2', borderBottom: activeTab === cat ? '2px solid #ea7c69' : 'none', transition: 'all 0.2s', '&:hover': { color: '#ea7c69' } }}>{cat}</Typography>
              ))}
            </Box>

            {/* Product Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {/* Add new card */}
              <Card onClick={() => handleOpen()} sx={{ bgcolor: 'transparent', borderRadius: '16px', border: '2px dashed #ea7c69', minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(234,124,105,0.05)' } }}>
                <AddIcon sx={{ fontSize: 40, color: '#ea7c69', mb: 1 }} />
                <Typography sx={{ color: '#ea7c69', fontWeight: 600 }}>Add new dish</Typography>
              </Card>

              {filtered.map((product) => (
                <Card key={product._id} sx={{ bgcolor: '#1f1d2b', borderRadius: '16px', border: '1px solid #393c49', overflow: 'hidden', transition: 'all 0.2s', '&:hover': { borderColor: '#ea7c69' } }}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <CardMedia component="img" image={product.image && product.image.startsWith('http') ? product.image : `${BACKEND_URL}${product.image || ''}`} alt={product.name} sx={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', mx: 'auto', mb: 1.5 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{product.name}</Typography>
                    <Typography variant="body2">$ {(product.price || 0).toFixed(2)} • {product.availableQuantity} Bowls</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', borderTop: '1px solid #393c49' }}>
                    <Button fullWidth startIcon={<EditIcon />} onClick={() => handleOpen(product)} sx={{ py: 1.2, color: '#ea7c69', borderRadius: 0, '&:hover': { bgcolor: 'rgba(234,124,105,0.1)' } }}>Edit dish</Button>
                    <IconButton onClick={() => handleDelete(product._id)} sx={{ color: '#ff7ca3', borderLeft: '1px solid #393c49', borderRadius: 0, px: 2 }}><DeleteIcon /></IconButton>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Add/Edit Product Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { bgcolor: '#252836', borderRadius: '16px' } } }}>
          <DialogTitle sx={{ color: '#fff' }}>{editingId ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent sx={{ pt: '16px !important' }}>
            <TextField label="Product Name" fullWidth sx={{ mb: 2 }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Price" type="number" fullWidth sx={{ mb: 2 }} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <TextField label="Image URL" fullWidth sx={{ mb: 2 }} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select value={form.category} label="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} sx={{ borderRadius: '12px' }}>
                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Recipe Builder */}
            <Typography variant="h4" sx={{ mb: 1.5 }}>Recipe (Raw Materials)</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <FormControl sx={{ flex: 2 }} size="small">
                <InputLabel>Material</InputLabel>
                <Select value={recipeMaterialId} label="Material" onChange={(e) => setRecipeMaterialId(e.target.value)} sx={{ borderRadius: '12px' }}>
                  {materials.map((m) => <MenuItem key={m._id} value={m._id}>{m.name} ({m.stock} {m.unit})</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="Qty" type="number" size="small" sx={{ flex: 1 }} value={recipeQty} onChange={(e) => setRecipeQty(Number(e.target.value))} />
              <Button variant="contained" onClick={addRecipeItem} sx={{ minWidth: 'auto', px: 2 }}><AddIcon /></Button>
            </Box>
            <List dense sx={{ bgcolor: '#1f1d2b', borderRadius: '12px', border: form.recipe.length ? '1px solid #393c49' : 'none' }}>
              {form.recipe.map((r, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={getMaterialName(r.materialId)} secondary={`${r.quantity} per unit`} sx={{ '& .MuiListItemText-primary': { color: '#fff' }, '& .MuiListItemText-secondary': { color: '#abbbc2' } }} />
                  <ListItemSecondaryAction><IconButton edge="end" size="small" onClick={() => removeRecipeItem(idx)} sx={{ color: '#ff7ca3' }}><DeleteIcon fontSize="small" /></IconButton></ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)} variant="outlined" sx={{ color: '#ea7c69', borderColor: '#ea7c69' }}>Discard Changes</Button>
            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
          <Alert severity={snack.severity} sx={{ borderRadius: '10px' }}>{snack.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
