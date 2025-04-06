// src/components/Widgets/BarChartWidget/BarChartWidget.tsx
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { IconButton, Card, CardHeader, CardContent, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BarChartWidget as BarChartWidgetType } from '../../../types/widget.types';
import './BarChartWidget.css';
import '../widget.enhanced.css';
import { useMockData } from '../../../hooks/useWidgetData';
import BarChartConfig from './BarChartConfig';

interface BarChartWidgetProps {
  widget: BarChartWidgetType;
  onRemove: (widgetId: string) => void;
}

const BarChartWidget: React.FC<BarChartWidgetProps> = ({ widget, onRemove }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showConfig, setShowConfig] = useState(false);
  const data = useMockData(widget.config.dataSource);

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
          <BarChartConfig widget={widget} onSave={() => setShowConfig(false)} />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={widget.config.xAxisKey} />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={widget.config.yAxisKey}
                fill={widget.config.color || '#8884d8'}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartWidget;