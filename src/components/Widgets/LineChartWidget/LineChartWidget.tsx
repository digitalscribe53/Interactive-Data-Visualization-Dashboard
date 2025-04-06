// src/components/Widgets/LineChartWidget/LineChartWidget.tsx
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { IconButton, Card, CardHeader, CardContent, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LineChartWidget as LineChartWidgetType } from '../../../types/widget.types';
import { useMockData } from '../../../hooks/useWidgetData';
import LineChartConfig from './LineChartConfig';
import '../widget.enhanced.css';

interface LineChartWidgetProps {
  widget: LineChartWidgetType;
  onRemove: (widgetId: string) => void;
}

const LineChartWidget: React.FC<LineChartWidgetProps> = ({ widget, onRemove }) => {
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
          <LineChartConfig widget={widget} onSave={() => setShowConfig(false)} />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={widget.config.xAxisKey} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={widget.config.yAxisKey}
                stroke={widget.config.color || '#8884d8'}
                activeDot={{ r: 8 }}
                dot={widget.config.showPoints}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default LineChartWidget;