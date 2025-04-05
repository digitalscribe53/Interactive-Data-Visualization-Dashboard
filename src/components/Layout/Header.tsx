// src/components/Layout/Header.tsx
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useDashboard } from '../../context/DashboardContext';
import './Layout.css';

interface HeaderProps {
  onMenuClick: () => void;
  onAddWidgetClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onAddWidgetClick }) => {
  const { currentDashboard } = useDashboard();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        
        <DashboardIcon sx={{ mr: 1 }} />
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {currentDashboard?.name || 'Dashboard App'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            startIcon={<AddIcon />}
            onClick={onAddWidgetClick}
          >
            Add Widget
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;