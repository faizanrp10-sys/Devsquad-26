'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const SIDEBAR_WIDTH = 72;

const navItems = [
  { path: '/', icon: <HomeIcon />, label: 'POS Home' },
  { path: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
  { path: '/inventory', icon: <InventoryIcon />, label: 'Inventory' },
  { path: '/settings', icon: <SettingsIcon />, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        minHeight: '100vh',
        bgcolor: '#1f1d2b',
        borderRight: '1px solid #393c49',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: '12px',
          background: '#ea7c69',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.05)' },
        }}
        onClick={() => router.push('/')}
      >
        <RestaurantMenuIcon sx={{ color: '#fff', fontSize: 26 }} />
      </Box>

      <List sx={{ width: '100%', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Tooltip key={item.path} title={item.label} placement="right" arrow>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  justifyContent: 'center',
                  py: 1.8,
                  my: 0.5,
                  mx: 'auto',
                  borderRadius: '12px',
                  width: 50,
                  position: 'relative',
                  color: isActive ? '#ea7c69' : '#abbbc2',
                  bgcolor: isActive ? 'rgba(234,124,105,0.08)' : 'transparent',
                  '&::before': isActive
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: -11,
                        top: '25%',
                        height: '50%',
                        width: 4,
                        borderRadius: '0 4px 4px 0',
                        bgcolor: '#ea7c69',
                      }
                    : {},
                  '&:hover': {
                    bgcolor: 'rgba(234,124,105,0.12)',
                    color: '#ea7c69',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 'auto',
                    color: 'inherit',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
}

export { SIDEBAR_WIDTH };
