// src/App.tsx
import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { DashboardProvider } from './context/DashboardContext';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import WidgetLibrary from './components/WidgetLibrary/WidgetLibrary';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [widgetLibraryOpen, setWidgetLibraryOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleWidgetLibrary = () => {
    setWidgetLibraryOpen(!widgetLibraryOpen);
  };

  return (
    <DashboardProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Header 
            onMenuClick={toggleSidebar} 
            onAddWidgetClick={toggleWidgetLibrary} 
          />
          <div className="app-content">
            <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
            <main className="main-content">
              <Dashboard />
            </main>
          </div>
          <WidgetLibrary 
            open={widgetLibraryOpen} 
            onClose={() => setWidgetLibraryOpen(false)} 
          />
        </div>
      </ThemeProvider>
    </DashboardProvider>
  );
};

export default App;