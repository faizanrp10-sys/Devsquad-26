'use client';
import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Snackbar, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Sidebar, { SIDEBAR_WIDTH } from '@/components/Sidebar';
import {
  useGetRawMaterialsQuery, useCreateRawMaterialMutation, useUpdateRawMaterialMutation, useDeleteRawMaterialMutation,
  RawMaterial,
} from '@/store/services/rawMaterialsApi';

const emptyForm = { name: '', unit: 'g', stock: 0, minLevel: 0 };

export default function InventoryPage() {
  const { data: materials = [], isLoading } = useGetRawMaterialsQuery();
  const [createMaterial] = useCreateRawMaterialMutation();
  const [updateMaterial] = useUpdateRawMaterialMutation();
  const [deleteMaterial] = useDeleteRawMaterialMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleOpen = (mat?: RawMaterial) => {
    if (mat) { setEditingId(mat._id); setForm({ name: mat.name, unit: mat.unit, stock: mat.stock, minLevel: mat.minLevel }); }
    else { setEditingId(null); setForm(emptyForm); }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) await updateMaterial({ id: editingId, data: { ...form, stock: Number(form.stock), minLevel: Number(form.minLevel) } }).unwrap();
      else await createMaterial({ ...form, stock: Number(form.stock), minLevel: Number(form.minLevel) }).unwrap();
      setSnack({ open: true, message: editingId ? 'Material updated' : 'Material added', severity: 'success' });
      setDialogOpen(false);
    } catch { setSnack({ open: true, message: 'Failed to save', severity: 'error' }); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteMaterial(id).unwrap(); setSnack({ open: true, message: 'Material deleted', severity: 'success' }); }
    catch { setSnack({ open: true, message: 'Failed to delete', severity: 'error' }); }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#252836' }}>
      <Sidebar />
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, flex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h1" sx={{ fontWeight: 700, mb: 0.5 }}>Raw Materials Inventory</Typography>
            <Typography variant="body2">Manage your raw materials stock levels</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ borderRadius: '12px' }}>Add Material</Button>
        </Box>

        <Card sx={{ bgcolor: '#1f1d2b', borderRadius: '16px', border: '1px solid #393c49' }}>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Name', 'Unit', 'Current Stock', 'Min Level', 'Status', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ color: '#abbbc2', borderColor: '#393c49', fontWeight: 600 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(materials).map((mat) => {
                    const isLow = mat.stock <= mat.minLevel;
                    return (
                      <TableRow key={mat._id} sx={{ '&:hover': { bgcolor: 'rgba(234,124,105,0.04)' } }}>
                        <TableCell sx={{ borderColor: '#393c49', color: '#fff', fontWeight: 500 }}>{mat.name}</TableCell>
                        <TableCell sx={{ borderColor: '#393c49', color: '#abbbc2' }}>{mat.unit}</TableCell>
                        <TableCell sx={{ borderColor: '#393c49', color: isLow ? '#ff7ca3' : '#fff', fontWeight: isLow ? 700 : 400 }}>{mat.stock.toLocaleString()}</TableCell>
                        <TableCell sx={{ borderColor: '#393c49', color: '#abbbc2' }}>{mat.minLevel.toLocaleString()}</TableCell>
                        <TableCell sx={{ borderColor: '#393c49' }}>
                          {isLow ? <Chip icon={<WarningAmberIcon sx={{ fontSize: 14 }} />} label="Low Stock" size="small" sx={{ bgcolor: '#ff7ca322', color: '#ff7ca3', fontWeight: 600 }} />
                            : <Chip label="In Stock" size="small" sx={{ bgcolor: '#50d1aa22', color: '#50d1aa', fontWeight: 600 }} />}
                        </TableCell>
                        <TableCell sx={{ borderColor: '#393c49' }}>
                          <IconButton size="small" onClick={() => handleOpen(mat)} sx={{ color: '#65b0f6', mr: 1 }}><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDelete(mat._id)} sx={{ color: '#ff7ca3' }}><DeleteIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} slotProps={{ paper: { sx: { bgcolor: '#252836', borderRadius: '16px', minWidth: 400 } } }}>
          <DialogTitle sx={{ color: '#fff' }}>{editingId ? 'Edit Material' : 'Add Material'}</DialogTitle>
          <DialogContent sx={{ pt: '16px !important' }}>
            <TextField label="Name" fullWidth sx={{ mb: 2 }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Unit (g, ml, pcs)" fullWidth sx={{ mb: 2 }} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            <TextField label="Stock" type="number" fullWidth sx={{ mb: 2 }} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            <TextField label="Min Level" type="number" fullWidth value={form.minLevel} onChange={(e) => setForm({ ...form, minLevel: Number(e.target.value) })} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ color: '#abbbc2' }}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
          <Alert severity={snack.severity} sx={{ borderRadius: '10px' }}>{snack.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
