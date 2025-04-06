// src/components/Widgets/TableWidget/TableConfig.tsx
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
  FormControlLabel,
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { TableWidget as TableWidgetType } from '../../../types/widget.types';
import { useDashboard } from '../../../context/DashboardContext';
import DataSourceManager from '../../DataSources/DataSourceManager';
import { useDataSources } from '../../../hooks/useDataSources';

interface TableConfigProps {
  widget: TableWidgetType;
  onSave: () => void;
}

interface ColumnDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (key: string, label: string, format?: string) => void;
  fieldOptions: string[];
}

const ColumnDialog: React.FC<ColumnDialogProps> = ({ open, onClose, onSave, fieldOptions }) => {
  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  const [format, setFormat] = useState<string | undefined>(undefined);

  const handleSave = () => {
    if (key && label) {
      onSave(key, label, format);
      setKey('');
      setLabel('');
      setFormat(undefined);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Column</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Data Field</InputLabel>
          <Select
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              if (!label) setLabel(e.target.value);
            }}
          >
            {fieldOptions.map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Column Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Format (Optional)</InputLabel>
          <Select
            value={format || ''}
            onChange={(e) => setFormat(e.target.value || undefined)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="currency">Currency</MenuItem>
            <MenuItem value="percentage">Percentage</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" disabled={!key || !label}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TableConfig: React.FC<TableConfigProps> = ({ widget, onSave }) => {
  const { updateWidget } = useDashboard();
  const [title, setTitle] = useState(widget.title);
  const [dataSource, setDataSource] = useState(widget.config.dataSource);
  const [columns, setColumns] = useState([...widget.config.columns]);
  const [pagination, setPagination] = useState(widget.config.pagination);
  const [rowsPerPage, setRowsPerPage] = useState(widget.config.rowsPerPage);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
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
      // Reset columns when data source changes
      setColumns([]);
    }
  };

  const handleSelectDataSource = (sourceId: string) => {
    setDataSource(sourceId);
    // Reset columns when data source changes
    setColumns([]);
  };

  const handleDeleteColumn = (index: number) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const handleAddColumn = (key: string, label: string, format?: string) => {
    const newColumn = { 
      key, 
      label, 
      format: format as 'number' | 'currency' | 'percentage' | 'date' | undefined 
    };
    setColumns([...columns, newColumn]);
  };

  const handleSave = () => {
    const updatedWidget: TableWidgetType = {
      ...widget,
      title,
      config: {
        ...widget.config,
        dataSource,
        columns,
        pagination,
        rowsPerPage,
      },
    };

    updateWidget(updatedWidget);
    onSave();
  };

  return (
    <div className="widget-config">
      <h3>Configure Table</h3>
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

        <Box mt={2} mb={1}>
          <Typography variant="subtitle1">Table Columns</Typography>
          <List dense>
            {columns.map((column, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={column.label} 
                  secondary={`Field: ${column.key}${column.format ? `, Format: ${column.format}` : ''}`} 
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDeleteColumn(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            size="small"
            onClick={() => setColumnDialogOpen(true)}
          >
            Add Column
          </Button>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={pagination}
              onChange={(e) => setPagination(e.target.checked)}
              color="primary"
            />
          }
          label="Enable Pagination"
        />

        {pagination && (
          <TextField
            label="Rows Per Page"
            type="number"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            fullWidth
            margin="normal"
            InputProps={{ inputProps: { min: 1, max: 100 } }}
          />
        )}

        <div className="config-actions">
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={onSave}>
            Cancel
          </Button>
        </div>
      </FormGroup>

      <ColumnDialog
        open={columnDialogOpen}
        onClose={() => setColumnDialogOpen(false)}
        onSave={handleAddColumn}
        fieldOptions={fieldOptions}
      />

      <DataSourceManager
        open={dataSourceManagerOpen}
        onClose={() => setDataSourceManagerOpen(false)}
        onSelectDataSource={handleSelectDataSource}
      />
    </div>
  );
};

export default TableConfig;