import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { fetchMembers, createMember, updateMember, deleteMember } from '../services/api';
import { staggerFadeIn } from '../components/animations/gsapUtils';
import AddIcon from '@mui/icons-material/Add';
import MemberCard from '../components/MemberCard';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentMember, setCurrentMember] = useState({ name: '', role: '', email: '', avatar: '' });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data } = await fetchMembers();
      setMembers(data);
      staggerFadeIn('.member-row', 0.1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpen = (member = null) => {
    if (member) {
      setIsEdit(true);
      setCurrentMember(member);
    } else {
      setIsEdit(false);
      setCurrentMember({ name: '', role: '', email: '', avatar: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await updateMember(currentMember._id, currentMember);
      } else {
        await createMember(currentMember);
      }
      loadMembers();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this member?')) {
      await deleteMember(id);
      loadMembers();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Team Directory</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Member</Button>
      </Box>

      <TableContainer component={Paper} elevation={6}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Projects</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <MemberCard 
                key={member._id} 
                member={member} 
                onEdit={handleOpen} 
                onDelete={handleDelete} 
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Member Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit Member' : 'Add New Member'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={currentMember.name}
            onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Role (e.g. Lead Designer)"
            fullWidth
            value={currentMember.role}
            onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={currentMember.email}
            onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Avatar URL (Optional)"
            fullWidth
            value={currentMember.avatar}
            onChange={(e) => setCurrentMember({ ...currentMember, avatar: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{isEdit ? 'Save Member' : 'Add Member'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Members;
