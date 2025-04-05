// src/components/WidgetLibrary/WidgetCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import SpeedIcon from '@mui/icons-material/Speed';
import './WidgetCard.css';

interface WidgetCardProps {
  title: string;
  type: string;
  onAdd: () => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, type, onAdd }) => {
  const getWidgetIcon = () => {
    switch (type) {
      case 'bar-chart':
        return <BarChartIcon fontSize="large" />;
      case 'line-chart':
        return <ShowChartIcon fontSize="large" />;
      case 'table':
        return <TableChartIcon fontSize="large" />;
      case 'kpi':
        return <SpeedIcon fontSize="large" />;
      default:
        return <BarChartIcon fontSize="large" />;
    }
  };

  return (
    <Card className="widget-library-card">
      <CardContent>
        <div className="widget-card-content">
          <div className="widget-card-icon">{getWidgetIcon()}</div>
          <div className="widget-card-info">
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Typography>
          </div>
        </div>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
          fullWidth
        >
          Add to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default WidgetCard;