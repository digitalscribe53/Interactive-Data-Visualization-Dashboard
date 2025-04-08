import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  IconButton, 
  Typography, 
  Menu, 
  MenuItem,
  Box,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { KpiWidget as KpiWidgetType } from '../../../types/widget.types';
import { useMockData } from '../../../hooks/useWidgetData';
import KpiConfig from './KpiConfig';
import '../widget.pro.css';

interface KpiWidgetProps {
  widget: KpiWidgetType;
  onRemove: (widgetId: string) => void;
  accentClass?: string;
}

const KpiWidget: React.FC<KpiWidgetProps> = ({ widget, onRemove, accentClass = 'accent-1' }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const data = useMockData(widget.config.dataSource);
  
  // Get the value from the first item in the data array with type safety
  const kpiValue = data.length > 0 
    ? (typeof data[0][widget.config.metricKey] === 'number' 
        ? data[0][widget.config.metricKey] as number 
        : 0)
    : 0;
  
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

  // Simulate loading when first showing the component
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate percentage of target if target is defined
  const percentOfTarget = widget.config.targetValue 
    ? (kpiValue / widget.config.targetValue) * 100 
    : null;
  
  const getStatusColor = (percent: number | null): string => {
    if (percent === null) return 'var(--primary-main)';
    if (percent >= 100) return 'var(--success)';
    if (percent >= 70) return 'var(--warning)';
    return 'var(--error)';
  };

  // Determine trend icon
  const getTrendIcon = (percent: number | null) => {
    if (percent === null) return <TrendingFlatIcon />;
    if (percent >= 100) return <TrendingUpIcon style={{ color: 'var(--success)' }} />;
    if (percent >= 70) return <TrendingFlatIcon style={{ color: 'var(--warning)' }} />;
    return <TrendingDownIcon style={{ color: 'var(--error)' }} />;
  };

  return (
    <Card className={`widget-card ${accentClass}`}>
      <CardHeader
        title={widget.title}
        action={
          <>
            <IconButton aria-label="settings" onClick={handleMenuClick} size="small">
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
        ) : loading ? (
          <div className="widget-loading">
            <CircularProgress size={40} />
            <Typography variant="body2" color="textSecondary">
              Loading data...
            </Typography>
          </div>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            position="relative"
          >
            <Typography 
              variant="h3" 
              component="div" 
              color={getStatusColor(percentOfTarget)}
              className="kpi-value"
            >
              {widget.config.prefix || ''}{formatValue(kpiValue)}{widget.config.suffix || ''}
            </Typography>
            
            {widget.config.targetValue && (
              <>
                <Box width="80%" position="relative" mb={2}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(percentOfTarget || 0, 100)}
                    style={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'var(--bg-hover)',
                    }}
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getStatusColor(percentOfTarget),
                      }
                    }}
                  />
                </Box>
                <Box display="flex" alignItems="center">
                  {getTrendIcon(percentOfTarget)}
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    className="kpi-target"
                    style={{ marginLeft: 4 }}
                  >
                    {percentOfTarget !== null 
                      ? `${Math.round(percentOfTarget)}% of target` 
                      : ''}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiWidget;