import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  IconButton, 
  Card, 
  CardHeader, 
  CardContent, 
  Menu, 
  MenuItem,
  CircularProgress,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { BarChartWidget as BarChartWidgetType } from '../../../types/widget.types';
import './BarChartWidget.css';
import '../widget.pro.css';
import { useMockData } from '../../../hooks/useWidgetData';
import BarChartConfig from './BarChartConfig';

interface BarChartWidgetProps {
  widget: BarChartWidgetType;
  onRemove: (widgetId: string) => void;
  accentClass?: string;
}

// Define the tooltip props type
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    color: string;
  }>;
  label?: string;
}

const BarChartWidget: React.FC<BarChartWidgetProps> = ({ widget, onRemove, accentClass = 'accent-1' }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showConfig, setShowConfig] = useState(false);
  const data = useMockData(widget.config.dataSource);
  const [loading, setLoading] = useState(false);
  // Keep error state but no need to set it since we're not using it directly
  const [error] = useState<string | null>(null);

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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: 'none',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 5px', fontWeight: 'bold' }}>{`${label}`}</p>
          <p style={{ margin: '0', color: payload[0].color }}>
            {`${widget.config.yAxisKey}: ${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
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
          <BarChartConfig widget={widget} onSave={() => setShowConfig(false)} />
        ) : loading ? (
          <div className="widget-loading">
            <CircularProgress size={40} />
            <Typography variant="body2" color="textSecondary">
              Loading data...
            </Typography>
          </div>
        ) : error ? (
          <div className="widget-error">
            <ErrorOutlineIcon fontSize="large" />
            <Typography variant="body2">
              {error}
            </Typography>
          </div>
        ) : data.length === 0 ? (
          <div className="widget-error">
            <ErrorOutlineIcon fontSize="large" />
            <Typography variant="body2">
              No data available
            </Typography>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={widget.config.xAxisKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#E0E0E0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ marginTop: 10 }} />
              <Bar
                dataKey={widget.config.yAxisKey}
                fill={widget.config.color || '#4285F4'}
                barSize={30}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartWidget;