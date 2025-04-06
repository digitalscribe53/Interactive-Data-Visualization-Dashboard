// src/components/Widgets/LineChartWidget/LineChartConfig.tsx
import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  FormGroup,
  Switch,
  FormControlLabel
} from '@mui/material';
import { LineChartWidget as LineChartWidgetType } from '../../../types/widget.types';
import { useDashboard } from '../../../context/DashboardContext';
import DataSourceManager from '../../DataSources/DataSourceManager';
import { useDataSources } from '../../../hooks/useDataSources';

interface LineChartConfigProps {
  widget: LineChartWidgetType;
  onSave: () => void;
}

const LineChartConfig: React.FC<LineChartConfigProps> = ({ widget, onSave }) => {
  const { updateWidget } = useDashboard();
  const [title, setTitle] = useState(widget.title);
  const [dataSource, setDataSource] = useState(widget.config.dataSource);
  const [xAxisKey, setXAxisKey] = useState(widget.config.xAxisKey);
  const [yAxisKey, setYAxisKey] = useState(widget.config.yAxisKey);
  const [color, setColor] = useState(widget.config.color);
  const [showPoints, setShowPoints] = useState(widget.config.showPoints);
  const [dataSourceManagerOpen, setDataSourceManagerOpen] = useState(false);

  // Data sources options
  const dataSources = [
    { id: 'sales', name: 'Sales Data' },
    { id: 'traffic', name: 'Website Traffic' },
    { id: 'performance', name: 'Performance Metrics' },
    { id: 'browse', name: 'Browse for data source...' }
  ];

  // Get field options for the selected data source
  const { getFieldsForDataSource } = useDataSources();
  
  // Get available fields for the selected data source
  const dataSourceFields = getFieldsForDataSource(dataSource);
  const fieldOptions = dataSourceFields.map(field => field.name);

  const handleDataSourceChange = (selectedDataSource: string) => {
    if (selectedDataSource === 'browse') {
      setDataSourceManagerOpen(true);
    } else {
      setDataSource(selectedDataSource);
      // Reset axis fields when data source changes
      setXAxisKey('');
      setYAxisKey('');
    }
  };

  const handleSelectDataSource = (sourceId: string) => {
    setDataSource(sourceId);
    // Reset axis fields when data source changes
    setXAxisKey('');
    setYAxisKey('');
  };

  const handleSave = () => {
    const updatedWidget: LineChartWidgetType = {
      ...widget,
      title,
      config: {
        ...widget.config,
        dataSource,
        xAxisKey,
        yAxisKey,
        color,
        showPoints,
      },
    };

    updateWidget(updatedWidget);
    onSave();
  };

  return (
    <div className="widget-config">
      <h3>Configure Line Chart</h3>
      <FormGroup>
        <TextField
          label="Widget Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Data Source</InputLabel>
          <Select
            value={dataSource}
            onChange={(e) => handleDataSourceChange(e.target.value)}
          >
            {dataSources.map((ds) => (
              <MenuItem key={ds.id} value={ds.id}>
                {ds.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>X-Axis Field</InputLabel>
          <Select
            value={xAxisKey}
            onChange={(e) => setXAxisKey(e.target.value)}
          >
            {fieldOptions.map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Y-Axis Field</InputLabel>
          <Select
            value={yAxisKey}
            onChange={(e) => setYAxisKey(e.target.value)}
          >
            {fieldOptions.map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Line Color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          fullWidth
          margin="normal"
        />

        <FormControlLabel
          control={
            <Switch
              checked={showPoints}
              onChange={(e) => setShowPoints(e.target.checked)}
              color="primary"
            />
          }
          label="Show Data Points"
        />

        <div className="config-actions">
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={onSave}>
            Cancel
          </Button>
        </div>
      </FormGroup>

      <DataSourceManager
        open={dataSourceManagerOpen}
        onClose={() => setDataSourceManagerOpen(false)}
        onSelectDataSource={handleSelectDataSource}
      />
    </div>
  );
};

export default LineChartConfig;