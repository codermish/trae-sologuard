import React, { useState, useEffect } from 'react';
import { dataSources, generateMockData, fetchMetricData, WebSocketDataSource } from '@/utils/grafanaDataSources';

interface MetricData {
  timestamp: number;
  value: number;
  label: string;
  metric?: string;
}

interface DashboardPanel {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'gauge' | 'table';
  data: MetricData[];
  color: string;
  dataSource: string;
  metric: string;
}

export default function GrafanaDashboard() {
  const [panels, setPanels] = useState<DashboardPanel[]>([
    {
      id: '1',
      title: 'API Response Time',
      type: 'line',
      color: '#3498db',
      data: [],
      dataSource: 'Travel API Metrics',
      metric: 'response_time'
    },
    {
      id: '2', 
      title: 'Request Count',
      type: 'bar',
      color: '#2ecc71',
      data: [],
      dataSource: 'Travel API Metrics',
      metric: 'request_count'
    },
    {
      id: '3',
      title: 'Success Rate',
      type: 'gauge',
      color: '#e74c3c',
      data: [],
      dataSource: 'Travel API Metrics',
      metric: 'error_rate'
    },
    {
      id: '4',
      title: 'CPU Usage',
      type: 'gauge',
      color: '#f39c12',
      data: [],
      dataSource: 'System Health',
      metric: 'cpu_usage'
    },
    {
      id: '5',
      title: 'Bookings per Hour',
      type: 'line',
      color: '#9b59b6',
      data: [],
      dataSource: 'Booking Analytics',
      metric: 'bookings_per_hour'
    },
    {
      id: '6',
      title: 'Revenue',
      type: 'bar',
      color: '#1abc9c',
      data: [],
      dataSource: 'Booking Analytics',
      metric: 'revenue'
    }
  ]);

  const [isRealTime, setIsRealTime] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Fetch data from sources
  const fetchDataForPanel = async (panel: DashboardPanel) => {
    const dataSource = dataSources.find(ds => ds.name === panel.dataSource);
    if (!dataSource) return;

    try {
      let newData;
      if (dataSource.type === 'api' && dataSource.url) {
        newData = await fetchMetricData(dataSource.url, panel.metric);
      } else {
        newData = generateMockData(panel.metric);
      }

      setPanels(prev => prev.map(p => 
        p.id === panel.id 
          ? { ...p, data: newData }
          : p
      ));
    } catch (error) {
      console.error(`Failed to fetch data for panel ${panel.title}:`, error);
      // Fallback to mock data
      const mockData = generateMockData(panel.metric);
      setPanels(prev => prev.map(p => 
        p.id === panel.id 
          ? { ...p, data: mockData }
          : p
      ));
    }
  };

  // Initial data fetch
  useEffect(() => {
    panels.forEach(panel => {
      fetchDataForPanel(panel);
    });
  }, []);

  // Real-time data updates
  useEffect(() => {
    if (!isRealTime) return;

    const intervals = panels.map(panel => {
      return setInterval(() => {
        fetchDataForPanel(panel);
      }, refreshInterval);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [isRealTime, refreshInterval, panels.length]);

  const LineChart = ({ panel }: { panel: DashboardPanel }) => {
    const maxValue = Math.max(...panel.data.map(d => d.value), 100);
    const width = 300;
    const height = 150;
    const padding = 20;

    const points = panel.data.map((point, index) => {
      const x = (index / (panel.data.length - 1 || 1)) * (width - 2 * padding) + padding;
      const y = height - padding - (point.value / maxValue) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{panel.title}</h3>
        <svg width={width} height={height} className="border border-gray-200 rounded">
          <polyline
            points={points}
            fill="none"
            stroke={panel.color}
            strokeWidth="2"
          />
          <text x={width - 50} y={20} className="text-sm fill-gray-600">
            {panel.data.length > 0 ? `${panel.data[panel.data.length - 1].value.toFixed(1)}ms` : '0ms'}
          </text>
        </svg>
      </div>
    );
  };

  const BarChart = ({ panel }: { panel: DashboardPanel }) => {
    const maxValue = Math.max(...panel.data.map(d => d.value), 100);
    const width = 300;
    const height = 150;
    const barWidth = width / panel.data.length - 2;

    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{panel.title}</h3>
        <svg width={width} height={height} className="border border-gray-200 rounded">
          {panel.data.map((point, index) => {
            const barHeight = (point.value / maxValue) * (height - 20);
            const x = index * (barWidth + 2);
            const y = height - barHeight;
            
            return (
              <rect
                key={index}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={panel.color}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const Gauge = ({ panel }: { panel: DashboardPanel }) => {
    const value = panel.data.length > 0 ? panel.data[panel.data.length - 1].value : 0;
    const percentage = (value / 100) * 100;

    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{panel.title}</h3>
        <div className="relative w-32 h-32 mx-auto">
          <svg width="128" height="128" className="transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={panel.color}
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{percentage.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPanel = (panel: DashboardPanel) => {
    switch (panel.type) {
      case 'line':
        return <LineChart panel={panel} />;
      case 'bar':
        return <BarChart panel={panel} />;
      case 'gauge':
        return <Gauge panel={panel} />;
      default:
        return <div>Unknown panel type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grafana Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring and analytics</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isRealTime}
                  onChange={(e) => setIsRealTime(e.target.checked)}
                  className="mr-2"
                />
                <span>Real-time updates</span>
              </label>
              
              {isRealTime && (
                <div className="flex items-center space-x-2">
                  <label>Refresh interval:</label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    <option value={1000}>1 second</option>
                    <option value={5000}>5 seconds</option>
                    <option value={10000}>10 seconds</option>
                    <option value={30000}>30 seconds</option>
                  </select>
                </div>
              )}
            </div>
            
            <button
              onClick={() => {
                setPanels(prev => prev.map(panel => ({
                  ...panel,
                  data: []
                })));
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Clear Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {panels.map(panel => (
            <div key={panel.id}>
              {renderPanel(panel)}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Table</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Timestamp</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Metric</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Value</th>
                </tr>
              </thead>
              <tbody>
                {panels[0].data.slice(-10).reverse().map((point, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(point.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">API Response</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {point.value.toFixed(2)}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}