// src/components/Widgets/KpiWidget/KpiConfig.tsx
import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  FormGroup
} from '@mui/material';
import { KpiWidget as KpiWidgetType } from '../../../types/widget.types';
import { useDashboard } from '../../../context/DashboardContext';
import DataSourceManager from '../../DataSources/DataSourceManager';
import { useDataSources } from '../../../hooks/useDataSources';
import '../widget-form.css';

interface KpiConfigProps {
  widget: KpiWidgetType;
  onSave: () => void;
}

const KpiConfig: React.FC<KpiConfigProps> = ({ widget, onSave }) => {
  const { updateWidget } = useDashboard();
  const [title, setTitle] = useState(widget.title);
  const [dataSource, setDataSource] = useState(widget.config.dataSource);
  const [metricKey, setMetricKey] = useState(widget.config.metricKey);
  const [format, setFormat] = useState(widget.config.format);
  const [targetValue, setTargetValue] = useState(widget.config.targetValue || 0);
  const [prefix, setPrefix] = useState(widget.config.prefix || '');
  const [suffix, setSuffix] = useState(widget.config.suffix || '');
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
  // Filter to only include numeric fields for KPIs
  const fieldOptions = dataSourceFields
    .filter(field => field.type === 'number')
    .map(field => field.name);

  const handleDataSourceChange = (selectedDataSource: string) => {
    if (selectedDataSource === 'browse') {
      setDataSourceManagerOpen(true);
    } else {
      setDataSource(selectedDataSource);
      // Reset metric field when data source changes
      setMetricKey('');
    }
  };

  const handleSelectDataSource = (sourceId: string) => {
    setDataSource(sourceId);
    // Reset metric field when data source changes
    setMetricKey('');
  };

  const handleSave = () => {
    const updatedWidget: KpiWidgetType = {
      ...widget,
      title,
      config: {
        ...widget.config,
        dataSource,
        metricKey,
        format,
        targetValue: targetValue || undefined,
        prefix: prefix || undefined,
        suffix: suffix || undefined,
      },
    };

    updateWidget(updatedWidget);
    onSave();
  };

  return (
    <div className="widget-config">
      <h3>Configure KPI</h3>
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
          <InputLabel>Metric</InputLabel>
          <Select
            value={metricKey}
            onChange={(e) => setMetricKey(e.target.value)}
          >
            {fieldOptions.map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Format</InputLabel>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'number' | 'currency' | 'percentage')}
          >
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="currency">Currency</MenuItem>
            <MenuItem value="percentage">Percentage</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Target Value (Optional)"
          type="number"
          value={targetValue}
          onChange={(e) => setTargetValue(Number(e.target.value))}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Prefix (Optional)"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Suffix (Optional)"
          value={suffix}
          onChange={(e) => setSuffix(e.target.value)}
          fullWidth
          margin="normal"
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

export default KpiConfig;