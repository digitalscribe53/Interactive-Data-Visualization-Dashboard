// src/components/Widgets/KpiWidget/KpiWidget.tsx
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  IconButton, 
  Typography, 
  Menu, 
  MenuItem,
  Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { KpiWidget as KpiWidgetType } from '../../../types/widget.types';
import { useMockData } from '../../../hooks/useWidgetData';
import KpiConfig from './KpiConfig';

interface KpiWidgetProps {
  widget: KpiWidgetType;
  onRemove: (widgetId: string) => void;
}

const KpiWidget: React.FC<KpiWidgetProps> = ({ widget, onRemove }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showConfig, setShowConfig] = useState(false);
  const data = useMockData(widget.config.dataSource);
  
  // Get the value from the first item in the data array
  const kpiValue = data.length > 0 ? data[0][widget.config.metricKey] : 0;
  
  // Format the value based on widget configuration
  const formatValue = (value: number): string => {
    switch (widget.config.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(value);
      case 'percentage':
        return new Intl.NumberFormat('en-US', { 
          style: 'percent', 
          minimumFractionDigits: 1 
        }).format(value / 100);
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = () => {
    onRemove(widget.id);
    handleClose();
  };

  const handleEdit = () => {
    setShowConfig(true);
    handleClose();
  };

  // Calculate percentage of target if target is defined
  const percentOfTarget = widget.config.targetValue 
    ? (kpiValue / widget.config.targetValue) * 100 
    : null;
  
  const getStatusColor = (percent: number | null): string => {
    if (percent === null) return '#3f51b5'; // Default color
    if (percent >= 100) return '#4caf50'; // Green
    if (percent >= 70) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <Card className="widget-card">
      <CardHeader
        title={widget.title}
        action={
          <>
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleRemove}>Remove</MenuItem>
            </Menu>
          </>
        }
      />
      <CardContent className="widget-content">
        {showConfig ? (
          <KpiConfig widget={widget} onSave={() => setShowConfig(false)} />
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h3" component="div" color={getStatusColor(percentOfTarget)}>
              {widget.config.prefix || ''}{formatValue(kpiValue)}{widget.config.suffix || ''}
            </Typography>
            
            {widget.config.targetValue && (
              <Typography variant="body2" color="textSecondary">
                {percentOfTarget !== null 
                  ? `${Math.round(percentOfTarget)}% of target` 
                  : ''}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiWidget;