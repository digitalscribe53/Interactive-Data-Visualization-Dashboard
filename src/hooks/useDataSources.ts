// src/hooks/useDataSources.ts
import { useState, useEffect, useCallback } from 'react';

// Mock data for demo sources
const mockData = {
  sales: [
    { month: 'Jan', revenue: 4000, profit: 2400, units: 240 },
    { month: 'Feb', revenue: 3000, profit: 1398, units: 210 },
    { month: 'Mar', revenue: 2000, profit: 9800, units: 290 },
    { month: 'Apr', revenue: 2780, profit: 3908, units: 200 },
    { month: 'May', revenue: 1890, profit: 4800, units: 218 },
    { month: 'Jun', revenue: 2390, profit: 3800, units: 250 },
    { month: 'Jul', revenue: 3490, profit: 4300, units: 210 },
  ],
  traffic: [
    { date: '01/01', page: 'Home', visitors: 4000, pageviews: 5400, bounceRate: 40 },
    { date: '01/02', page: 'Home', visitors: 3000, pageviews: 4398, bounceRate: 42 },
    { date: '01/03', page: 'Home', visitors: 2000, pageviews: 3800, bounceRate: 35 },
    { date: '01/04', page: 'Home', visitors: 2780, pageviews: 3908, bounceRate: 28 },
    { date: '01/05', page: 'Home', visitors: 1890, pageviews: 3800, bounceRate: 30 },
    { date: '01/06', page: 'Home', visitors: 2390, pageviews: 4800, bounceRate: 32 },
    { date: '01/07', page: 'Home', visitors: 3490, pageviews: 6300, bounceRate: 25 },
  ],
  performance: [
    { team: 'Team A', metric: 'Productivity', value: 85, target: 80, variance: 5 },
    { team: 'Team B', metric: 'Productivity', value: 75, target: 80, variance: -5 },
    { team: 'Team C', metric: 'Productivity', value: 90, target: 80, variance: 10 },
    { team: 'Team A', metric: 'Quality', value: 95, target: 90, variance: 5 },
    { team: 'Team B', metric: 'Quality', value: 85, target: 90, variance: -5 },
    { team: 'Team C', metric: 'Quality', value: 92, target: 90, variance: 2 },
  ],
};

interface DataField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'unknown';
}

export interface DataSource {
  id: string;
  name: string;
  type: 'csv' | 'excel' | 'json' | 'demo';
  dateAdded: Date;
  data: Record<string, unknown>[];
}

export const useDataSources = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { id: 'sales', name: 'Sales Data (Demo)', type: 'demo', dateAdded: new Date(), data: [] },
    { id: 'traffic', name: 'Website Traffic (Demo)', type: 'demo', dateAdded: new Date(), data: [] },
    { id: 'performance', name: 'Performance Metrics (Demo)', type: 'demo', dateAdded: new Date(), data: [] },
  ]);

  // Load user data sources from localStorage on mount
  useEffect(() => {
    const loadDataSources = () => {
      try {
        const savedSources = localStorage.getItem('dataSources');
        if (savedSources) {
          const parsedSources = JSON.parse(savedSources);
          // Convert string dates back to Date objects
          const processedSources = parsedSources.map((source: Record<string, unknown>) => ({
            ...source,
            dateAdded: new Date(source.dateAdded as string)
          }));
          
          // Combine demo sources with user sources
          const demoSources = dataSources.filter(ds => ds.type === 'demo');
          const userSources = processedSources.filter((ds: DataSource) => ds.type !== 'demo');
          setDataSources([...demoSources, ...userSources]);
        }
      } catch (error) {
        console.error('Error loading data sources:', error);
      }
    };

    loadDataSources();
  }, [dataSources]); // Include dataSources in the dependency array

  // Get a specific data source by ID
  const getDataSourceById = useCallback((sourceId: string): DataSource | undefined => {
    // First check if it's a demo source
    if (['sales', 'traffic', 'performance'].includes(sourceId)) {
      // For demo sources, use mock data
      const demoSource = dataSources.find(ds => ds.id === sourceId);
      if (demoSource) {
        const demoData = mockData[sourceId as keyof typeof mockData] || [];
        return {
          ...demoSource,
          data: demoData as Record<string, unknown>[]
        };
      }
    }
    
    // Otherwise, get from user sources
    return dataSources.find(ds => ds.id === sourceId);
  }, [dataSources]);

  // Get fields for a data source
  const getFieldsForDataSource = useCallback((sourceId: string): DataField[] => {
    const source = getDataSourceById(sourceId);
    
    if (!source || !source.data || source.data.length === 0) {
      return [];
    }
    
    // Use the first row to determine fields
    const firstRow = source.data[0];
    
    return Object.keys(firstRow).map(key => {
      // Determine field type
      const value = firstRow[key];
      let type: 'string' | 'number' | 'boolean' | 'date' | 'unknown' = 'unknown';
      
      if (typeof value === 'string') {
        // Check if it might be a date
        if (!isNaN(Date.parse(value))) {
          type = 'date';
        } else {
          type = 'string';
        }
      } else if (typeof value === 'number') {
        type = 'number';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      }
      
      return {
        name: key,
        type
      };
    });
  }, [getDataSourceById]);

  // Add a new data source
  const addDataSource = useCallback((newSource: DataSource) => {
    setDataSources(prev => {
      const updatedSources = [...prev, newSource];
      
      // Save to localStorage (excluding demo sources)
      const sourcesToSave = updatedSources.filter(ds => ds.type !== 'demo');
      localStorage.setItem('dataSources', JSON.stringify(sourcesToSave));
      
      return updatedSources;
    });
  }, []);

  // Remove a data source
  const removeDataSource = useCallback((sourceId: string) => {
    // Don't allow deletion of demo sources
    if (['sales', 'traffic', 'performance'].includes(sourceId)) {
      return false;
    }
    
    setDataSources(prev => {
      const updatedSources = prev.filter(ds => ds.id !== sourceId);
      
      // Save to localStorage (excluding demo sources)
      const sourcesToSave = updatedSources.filter(ds => ds.type !== 'demo');
      localStorage.setItem('dataSources', JSON.stringify(sourcesToSave));
      
      return updatedSources;
    });
    
    return true;
  }, []);

  return {
    dataSources,
    getDataSourceById,
    getFieldsForDataSource,
    addDataSource,
    removeDataSource
  };
};