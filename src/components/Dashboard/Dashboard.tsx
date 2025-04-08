// src/components/Dashboard/Dashboard.tsx
import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboard } from '../../context/DashboardContext';
import BarChartWidget from '../Widgets/BarChartWidget/BarChartWidget';
import LineChartWidget from '../Widgets/LineChartWidget/LineChartWidget';
import KpiWidget from '../Widgets/KpiWidget/KpiWidget';
import TableWidget from '../Widgets/TableWidget/TableWidget';
import { Widget, WidgetPosition } from '../../types/widget.types';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DashboardHint from './DashboardHint';
import emptyStateImage from '../../assets/empty-dashboard.svg';
import './Dashboard.css';
import './Dashboard.pro.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Define layout item interface
interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
}

const Dashboard: React.FC = () => {
  const { widgets, updateWidgetPosition, removeWidget, currentDashboard } = useDashboard();
  const [editMode, setEditMode] = useState(false);

  const handleLayoutChange = (layout: LayoutItem[]) => {
    // Update positions when layout changes
    layout.forEach((item) => {
      const widgetId = item.i;
      const position: WidgetPosition = {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      };
      updateWidgetPosition(widgetId, position);
    });
  };

  // Function to assign a consistent color accent based on widget id
  const getWidgetAccentClass = (widgetId: string) => {
    // Simple hash function to get a number from string
    const hash = widgetId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // Get a number between 1-8 for our accent classes
    const accentNumber = (hash % 8) + 1;
    return `accent-${accentNumber}`;
  };

  const renderWidget = (widget: Widget) => {
    // Add accent class based on widget ID
    const accentClass = getWidgetAccentClass(widget.id);
    
    switch (widget.type) {
      case 'bar-chart':
        return (
          <div className="widget-wrapper">
            <BarChartWidget 
              key={widget.id} 
              widget={widget} 
              onRemove={removeWidget} 
              accentClass={accentClass}
            />
          </div>
        );
      case 'line-chart':
        return (
          <div className="widget-wrapper">
            <LineChartWidget 
              key={widget.id} 
              widget={widget} 
              onRemove={removeWidget} 
            />
          </div>
        );
      case 'kpi':
        return (
          <div className="widget-wrapper">
            <KpiWidget 
              key={widget.id} 
              widget={widget} 
              onRemove={removeWidget} 
              accentClass={accentClass}
            />
          </div>
        );
      case 'table':
        return (
          <div className="widget-wrapper">
            <TableWidget 
              key={widget.id} 
              widget={widget} 
              onRemove={removeWidget} 
            />
          </div>
        );
      default:
        return <div>Unknown widget type</div>;
    }
  };

  const generateLayout = () => {
    return widgets.map((widget) => ({
      i: widget.id,
      x: widget.position.x,
      y: widget.position.y,
      w: widget.position.w,
      h: widget.position.h,
      minW: 2,
      minH: 2,
    }));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>{currentDashboard?.name || 'My Dashboard'}</h2>
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? <DoneIcon style={{ marginRight: '8px' }} /> : <EditIcon style={{ marginRight: '8px' }} />}
          {editMode ? 'Done' : 'Edit Dashboard'}
        </button>
      </div>

      {widgets.length === 0 ? (
        <div className="empty-dashboard">
          <img 
            src={emptyStateImage} 
            alt="Empty dashboard" 
            style={{ width: '180px', height: '180px' }}
            onError={(e) => {
              // Fallback if image is missing
              e.currentTarget.style.display = 'none';
            }}
          />
          <h3>Your dashboard is empty</h3>
          <p>
            Click "Edit Dashboard" and add widgets from the sidebar to start
            building your custom data visualization dashboard.
          </p>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: generateLayout() }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          isDraggable={editMode}
          isResizable={editMode}
          onLayoutChange={handleLayoutChange}
          margin={[16, 16]}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className="widget-container">
              {renderWidget(widget)}
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
      
      {/* Show helpful hints to users */}
      <DashboardHint delay={3000} />
    </div>
  );
};

export default Dashboard;