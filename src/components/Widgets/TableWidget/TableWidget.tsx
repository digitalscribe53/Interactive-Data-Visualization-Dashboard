// src/components/Widgets/TableWidget/TableWidget.tsx
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  IconButton, 
  Menu, 
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { TableWidget as TableWidgetType } from '../../../types/widget.types';
import { useMockData } from '../../../hooks/useWidgetData';
import TableConfig from './TableConfig';
import '../widget.enhanced.css';

interface TableWidgetProps {
  widget: TableWidgetType;
  onRemove: (widgetId: string) => void;
}

const TableWidget: React.FC<TableWidgetProps> = ({ widget, onRemove }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(widget.config.rowsPerPage);
  
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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format a cell value based on the column configuration
  const formatCellValue = (value: unknown, format?: string): string => {
    if (value === undefined || value === null) return '';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(Number(value));
      case 'percentage':
        return new Intl.NumberFormat('en-US', { 
          style: 'percent', 
          minimumFractionDigits: 1 
        }).format(Number(value) / 100);
      case 'date':
        // Make sure we convert to string before parsing date
        return new Date(String(value)).toLocaleDateString();
      default:
        return String(value);
    }
  };

  // Get the rows to display based on pagination
  const paginatedData = widget.config.pagination 
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data;

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
          <TableConfig widget={widget} onSave={() => setShowConfig(false)} />
        ) : (
          <>
            <TableContainer component={Paper} style={{ maxHeight: '100%', overflow: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {widget.config.columns.map((column, index) => (
                      <TableCell key={index}>{column.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {widget.config.columns.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          {formatCellValue(row[column.key], column.format)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {widget.config.pagination && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TableWidget;