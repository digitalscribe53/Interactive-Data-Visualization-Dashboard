// src/hooks/useWidgetData.ts
import { useState, useEffect } from 'react';
import { useDataSources } from './useDataSources';

// Mock data
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

export const useMockData = (dataSourceId: string): Record<string, unknown>[] => {
  const { getDataSourceById } = useDataSources();
  const [data, setData] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!dataSourceId) {
      setData([]);
      return;
    }

    // Check if this is a user-uploaded data source
    if (dataSourceId.startsWith('user-source-')) {
      const userSource = getDataSourceById(dataSourceId);
      if (userSource && userSource.data) {
        setData(userSource.data);
      } else {
        setData([]);
      }
    } 
    // Otherwise use the demo data
    else if (mockData[dataSourceId as keyof typeof mockData]) {
      setData(mockData[dataSourceId as keyof typeof mockData] as Record<string, unknown>[]);
    } else {
      setData([]);
    }
  }, [dataSourceId, getDataSourceById]);

  return data;
};