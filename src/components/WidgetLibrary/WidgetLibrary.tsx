// src/components/WidgetLibrary/WidgetLibrary.tsx
import React from 'react';
import { 
  Grid, 
  Typography, 
  Drawer, 
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDashboard } from '../../context/DashboardContext';
import WidgetCard from './WidgetCard';
import './WidgetLibrary.css';

interface WidgetLibraryProps {
  open: boolean;
  onClose: () => void;
}

const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ open, onClose }) => {
  const { availableWidgets, addWidget } = useDashboard();

  const handleAddWidget = (widgetType: string) => {
    // Create default configurations based on widget type
    switch (widgetType) {
      case 'bar-chart':
        addWidget({
          title: 'New Bar Chart',
          type: 'bar-chart',
          config: {
            dataSource: 'sales',
            xAxisKey: 'month',
            yAxisKey: 'revenue',
            color: '#8884d8',
          },
        });
        break;
      case 'line-chart':
        addWidget({
          title: 'New Line Chart',
          type: 'line-chart',
          config: {
            dataSource: 'traffic',
            xAxisKey: 'date',
            yAxisKey: 'visitors',
            color: '#82ca9d',
            showPoints: true,
          },
        });
        break;
      case 'kpi':
        addWidget({
          title: 'New KPI',
          type: 'kpi',
          config: {
            dataSource: 'performance',
            metricKey: 'value',
            format: 'number',
            targetValue: 100,
          },
        });
        break;
      case 'table':
        addWidget({
          title: 'New Table',
          type: 'table',
          config: {
            dataSource: 'sales',
            columns: [
              { key: 'month', label: 'Month' },
              { key: 'revenue', label: 'Revenue', format: 'currency' },
              { key: 'units', label: 'Units' },
            ],
            pagination: true,
            rowsPerPage: 5,
          },
        });
        break;
    }
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className="widget-library-drawer"
    >
      <div className="widget-library">
        <div className="widget-library-header">
          <Typography variant="h5">Widget Library</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <div className="widget-library-content">
          <Typography variant="subtitle1" gutterBottom>
            Select a widget to add to your dashboard
          </Typography>
          <Grid container spacing={2}>
            {availableWidgets.map((widget, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <WidgetCard
                  title={widget.title || ''}
                  type={widget.type || ''}
                  onAdd={() => handleAddWidget(widget.type || '')}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </Drawer>
  );
};

export default WidgetLibrary;