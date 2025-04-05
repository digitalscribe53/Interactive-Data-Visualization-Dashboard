// src/components/Layout/Sidebar.tsx
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useDashboard } from '../../context/DashboardContext';
import './Layout.css';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { dashboards, currentDashboard, switchDashboard, createDashboard } = useDashboard();
  const [newDashboardDialogOpen, setNewDashboardDialogOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');

  const handleCreateDashboard = () => {
    if (newDashboardName.trim()) {
      createDashboard(newDashboardName);
      setNewDashboardName('');
      setNewDashboardDialogOpen(false);
    }
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        className="sidebar-drawer"
      >
        <div className="sidebar">
          <div className="sidebar-header">
            <Typography variant="h6">Dashboards</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {dashboards.map((dashboard) => (
              <ListItem key={dashboard.id} disablePadding>
                <ListItemButton
                  selected={currentDashboard?.id === dashboard.id}
                  onClick={() => {
                    switchDashboard(dashboard.id);
                    onClose();
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary={dashboard.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <div className="sidebar-actions">
            <Button
              startIcon={<AddIcon />}
              onClick={() => setNewDashboardDialogOpen(true)}
              fullWidth
              variant="outlined"
            >
              New Dashboard
            </Button>
          </div>
        </div>
      </Drawer>

      <Dialog open={newDashboardDialogOpen} onClose={() => setNewDashboardDialogOpen(false)}>
        <DialogTitle>Create New Dashboard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Dashboard Name"
            fullWidth
            value={newDashboardName}
            onChange={(e) => setNewDashboardName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDashboardDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateDashboard} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;