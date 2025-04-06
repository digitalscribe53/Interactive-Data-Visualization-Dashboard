// src/components/DataSources/DataSourceManager.tsx
import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Box,
  TextField,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useDataSources } from '../../hooks/useDataSources';

interface DataSourceManagerProps {
  open: boolean;
  onClose: () => void;
  onSelectDataSource: (sourceId: string) => void;
}

const DataSourceManager: React.FC<DataSourceManagerProps> = ({ 
  open, 
  onClose,
  onSelectDataSource 
}) => {
  const { dataSources, addDataSource, removeDataSource } = useDataSources();
  const [isUploading, setIsUploading] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    setIsUploading(true);
    
    try {
      let parsedData: Record<string, unknown>[] = [];
      let sourceType: 'csv' | 'excel' | 'json' = 'csv';
      
      // Parse based on file type
      if (fileExtension === 'csv') {
        parsedData = await parseCSV(file);
        sourceType = 'csv';
      } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
        parsedData = await parseExcel(file);
        sourceType = 'excel';
      } else if (fileExtension === 'json') {
        parsedData = await parseJSON(file);
        sourceType = 'json';
      } else {
        alert('Unsupported file type. Please upload CSV, Excel, or JSON files.');
        setIsUploading(false);
        return;
      }
      
      // Generate a unique ID
      const newSourceId = `user-source-${Date.now()}`;
      
      // Use the file name if no source name provided
      const newSourceName = sourceName || file.name.split('.')[0];
      
      // Add the new data source using the hook
      const newDataSource = {
        id: newSourceId,
        name: newSourceName,
        type: sourceType,
        dateAdded: new Date(),
        data: parsedData
      };
      
      addDataSource(newDataSource);
      setSourceName('');
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the file format and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const parseCSV = (file: File): Promise<Record<string, unknown>[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            reject(results.errors);
          } else {
            // Explicitly cast to Record<string, unknown>[]
            const typedData = results.data as Record<string, unknown>[];
            resolve(typedData);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const parseExcel = (file: File): Promise<Record<string, unknown>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          // Cast the result to Record<string, unknown>[]
          resolve(jsonData as Record<string, unknown>[]);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsBinaryString(file);
    });
  };

  const parseJSON = (file: File): Promise<Record<string, unknown>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          // Ensure the data is an array
          const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
          // Cast the unknown array to Record<string, unknown>[]
          const typedArray = dataArray.map(item => item as Record<string, unknown>);
          resolve(typedArray);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  };

  const handleDeleteSource = (sourceId: string) => {
    // Use the hook to remove a data source
    const success = removeDataSource(sourceId);
    
    if (!success) {
      alert('Demo data sources cannot be deleted.');
    }
  };

  const handleSelectSource = (sourceId: string) => {
    onSelectDataSource(sourceId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Data Sources</DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Upload New Data Source
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              label="Source Name (Optional)"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              disabled={isUploading}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              ref={fileInputRef}
              disabled={isUploading}
            />
            <Button
              variant="contained"
              startIcon={isUploading ? <CircularProgress size={20} /> : <UploadFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </Box>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Supported file types: CSV, Excel (.xlsx, .xls), JSON
          </Typography>
        </Box>
        
        <Divider />
        
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>
            Available Data Sources
          </Typography>
          <List>
            {dataSources.map((source) => (
              <ListItem 
                key={source.id}
                onClick={() => handleSelectSource(source.id)}
              >
                <ListItemText
                  primary={source.name}
                  secondary={`Type: ${source.type.toUpperCase()} • Added: ${source.dateAdded.toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSource(source.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataSourceManager;