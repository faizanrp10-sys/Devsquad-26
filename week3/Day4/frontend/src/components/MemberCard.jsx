import React from 'react';
import { TableRow, TableCell, Avatar, Stack, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const MemberCard = ({ member, onEdit, onDelete }) => {
  // Although called "Card", in the current table design it's a TableRow.
  // We can keep it as a row or make it a real card. 
  // Given the current table implementation in Members.jsx, I'll provide a card version or row version.
  // The user suggested "MemberCard.jsx" so let's provide a Card version for the Dashboard/Members grid 
  // and keep the table row refactored optionally, or just use Cards in the members page too.
  // Let's go with a Card for visual consistency with ProjectCard.
  
  return (
    <TableRow className="member-row">
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={member.avatar}>{member.name.charAt(0)}</Avatar>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>{member.name}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{member.role}</TableCell>
      <TableCell>{member.email}</TableCell>
      <TableCell>{member.projects?.length || 0}</TableCell>
      <TableCell align="right">
        <Button size="small" onClick={() => onEdit(member)}><EditIcon fontSize="small" /></Button>
        <Button size="small" color="error" onClick={() => onDelete(member._id)}><DeleteIcon fontSize="small" /></Button>
      </TableCell>
    </TableRow>
  );
};

export default MemberCard;
