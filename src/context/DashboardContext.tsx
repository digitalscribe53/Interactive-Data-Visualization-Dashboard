// src/context/DashboardContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dashboard, Widget, WidgetPosition } from '../types/widget.types';
import { v4 as uuidv4 } from 'uuid'; 

interface DashboardContextType {
  dashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  widgets: Widget[];
  availableWidgets: Partial<Widget>[];
  addWidget: (widget: Omit<Widget, 'id' | 'position'>) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widget: Widget) => void;
  updateWidgetPosition: (widgetId: string, position: WidgetPosition) => void;
  createDashboard: (name: string) => void;
  switchDashboard: (dashboardId: string) => void;
  saveDashboard: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Sample available widgets
const sampleAvailableWidgets: Partial<Widget>[] = [
  {
    title: 'Bar Chart',
    type: 'bar-chart',
  },
  {
    title: 'Line Chart',
    type: 'line-chart',
  },
  {
    title: 'KPI Card',
    type: 'kpi',
  },
  {
    title: 'Data Table',
    type: 'table',
  },
];

// Initial dashboard
const initialDashboard: Dashboard = {
  id: 'default-dashboard',
  name: 'My Dashboard',
  widgets: [],
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([initialDashboard]);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(initialDashboard);
  const [availableWidgets] = useState<Partial<Widget>[]>(sampleAvailableWidgets);

  // Load dashboards from localStorage
  useEffect(() => {
    const savedDashboards = localStorage.getItem('dashboards');
    if (savedDashboards) {
      const parsedDashboards = JSON.parse(savedDashboards);
      setDashboards(parsedDashboards);
      
      // Set the first dashboard as current
      if (parsedDashboards.length > 0) {
        setCurrentDashboard(parsedDashboards[0]);
      }
    }
  }, []);

  const saveDashboard = () => {
    localStorage.setItem('dashboards', JSON.stringify(dashboards));
  };

  // Auto-save when dashboards change
  useEffect(() => {
    saveDashboard();
  }, [dashboards]);

  const addWidget = (widget: Omit<Widget, 'id' | 'position'>) => {
    if (!currentDashboard) return;

    const newWidget = {
      ...widget,
      id: uuidv4(),
      position: {
        x: 0,
        y: 0,
        w: 6,
        h: 4,
      },
    } as Widget;

    const updatedDashboard = {
      ...currentDashboard,
      widgets: [...currentDashboard.widgets, newWidget],
    };

    setCurrentDashboard(updatedDashboard);
    setDashboards(
      dashboards.map((d) => (d.id === updatedDashboard.id ? updatedDashboard : d))
    );
  };

  const removeWidget = (widgetId: string) => {
    if (!currentDashboard) return;

    const updatedDashboard = {
      ...currentDashboard,
      widgets: currentDashboard.widgets.filter((w) => w.id !== widgetId),
    };

    setCurrentDashboard(updatedDashboard);
    setDashboards(
      dashboards.map((d) => (d.id === updatedDashboard.id ? updatedDashboard : d))
    );
  };

  const updateWidget = (widget: Widget) => {
    if (!currentDashboard) return;

    const updatedDashboard = {
      ...currentDashboard,
      widgets: currentDashboard.widgets.map((w) => (w.id === widget.id ? widget : w)),
    };

    setCurrentDashboard(updatedDashboard);
    setDashboards(
      dashboards.map((d) => (d.id === updatedDashboard.id ? updatedDashboard : d))
    );
  };

  const updateWidgetPosition = (widgetId: string, position: WidgetPosition) => {
    if (!currentDashboard) return;

    const updatedDashboard = {
      ...currentDashboard,
      widgets: currentDashboard.widgets.map((w) =>
        w.id === widgetId ? { ...w, position } : w
      ),
    };

    setCurrentDashboard(updatedDashboard);
    setDashboards(
      dashboards.map((d) => (d.id === updatedDashboard.id ? updatedDashboard : d))
    );
  };

  const createDashboard = (name: string) => {
    const newDashboard: Dashboard = {
      id: uuidv4(),
      name,
      widgets: [],
    };

    setDashboards([...dashboards, newDashboard]);
    setCurrentDashboard(newDashboard);
  };

  const switchDashboard = (dashboardId: string) => {
    const dashboard = dashboards.find((d) => d.id === dashboardId);
    if (dashboard) {
      setCurrentDashboard(dashboard);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboards,
        currentDashboard,
        widgets: currentDashboard?.widgets || [],
        availableWidgets,
        addWidget,
        removeWidget,
        updateWidget,
        updateWidgetPosition,
        createDashboard,
        switchDashboard,
        saveDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};