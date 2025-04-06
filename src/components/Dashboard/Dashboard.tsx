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
import './Dashboard.css';
import './Dashboard.enhanced.css';

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
  const { widgets, updateWidgetPosition, removeWidget } = useDashboard();
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

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'bar-chart':
        return <BarChartWidget key={widget.id} widget={widget} onRemove={removeWidget} />;
      case 'line-chart':
        return <LineChartWidget key={widget.id} widget={widget} onRemove={removeWidget} />;
      case 'kpi':
        return <KpiWidget key={widget.id} widget={widget} onRemove={removeWidget} />;
      case 'table':
        return <TableWidget key={widget.id} widget={widget} onRemove={removeWidget} />;
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
        <h2>My Dashboard</h2>
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Done Editing' : 'Edit Dashboard'}
        </button>
      </div>

      {widgets.length === 0 ? (
        <div className="empty-dashboard">
          <h3>No widgets added yet</h3>
          <p>Click "Edit Dashboard" and add widgets from the sidebar</p>
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
        >
          {widgets.map((widget) => (
            <div key={widget.id} className="widget-container">
              {renderWidget(widget)}
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
};

export default Dashboard;