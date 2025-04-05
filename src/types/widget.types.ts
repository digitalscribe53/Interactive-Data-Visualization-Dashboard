// src/types/widget.types.ts

export type WidgetType = 'bar-chart' | 'line-chart' | 'pie-chart' | 'kpi' | 'table';

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetBase {
  id: string;
  title: string;
  type: WidgetType;
  position: WidgetPosition;
}

export interface DataSource {
  id: string;
  name: string;
  endpoint: string;
}

// Bar Chart Widget
export interface BarChartWidgetConfig {
  dataSource: string;
  xAxisKey: string;
  yAxisKey: string;
  color: string;
}

export interface BarChartWidget extends WidgetBase {
  type: 'bar-chart';
  config: BarChartWidgetConfig;
}

// Line Chart Widget
export interface LineChartWidgetConfig {
  dataSource: string;
  xAxisKey: string;
  yAxisKey: string;
  color: string;
  showPoints: boolean;
}

export interface LineChartWidget extends WidgetBase {
  type: 'line-chart';
  config: LineChartWidgetConfig;
}

// KPI Widget
export interface KpiWidgetConfig {
  dataSource: string;
  metricKey: string;
  format: 'number' | 'currency' | 'percentage';
  targetValue?: number;
  prefix?: string;
  suffix?: string;
}

export interface KpiWidget extends WidgetBase {
  type: 'kpi';
  config: KpiWidgetConfig;
}

// Table Widget
export interface TableWidgetConfig {
  dataSource: string;
  columns: {
    key: string;
    label: string;
    format?: 'number' | 'currency' | 'percentage' | 'date';
  }[];
  pagination: boolean;
  rowsPerPage: number;
}

export interface TableWidget extends WidgetBase {
  type: 'table';
  config: TableWidgetConfig;
}

// Union type for all widgets
export type Widget = BarChartWidget | LineChartWidget | KpiWidget | TableWidget;

// Dashboard type
export interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
  layout?: any; // For storing react-grid-layout information
}