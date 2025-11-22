// Grafana Data Source Configuration
export interface DataSourceConfig {
  name: string;
  type: 'api' | 'websocket' | 'mock';
  url?: string;
  refreshInterval: number;
  metrics: string[];
}

export const dataSources: DataSourceConfig[] = [
  {
    name: 'Travel API Metrics',
    type: 'api',
    url: '/api/metrics',
    refreshInterval: 5000,
    metrics: ['response_time', 'request_count', 'error_rate', 'user_sessions']
  },
  {
    name: 'Booking Analytics',
    type: 'mock',
    refreshInterval: 10000,
    metrics: ['bookings_per_hour', 'revenue', 'conversion_rate', 'popular_destinations']
  },
  {
    name: 'System Health',
    type: 'api',
    url: '/api/health',
    refreshInterval: 30000,
    metrics: ['cpu_usage', 'memory_usage', 'disk_space', 'network_io']
  }
];

// Mock data generator for demonstration
export const generateMockData = (metric: string, count: number = 20) => {
  const data = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - i) * 5000; // 5-second intervals
    let value: number;
    
    switch (metric) {
      case 'response_time':
        value = 50 + Math.random() * 200; // 50-250ms
        break;
      case 'request_count':
        value = Math.floor(Math.random() * 1000); // 0-1000 requests
        break;
      case 'error_rate':
        value = Math.random() * 5; // 0-5% error rate
        break;
      case 'cpu_usage':
        value = 20 + Math.random() * 60; // 20-80% CPU
        break;
      case 'memory_usage':
        value = 40 + Math.random() * 40; // 40-80% memory
        break;
      case 'bookings_per_hour':
        value = Math.floor(Math.random() * 50); // 0-50 bookings/hour
        break;
      case 'revenue':
        value = Math.random() * 10000; // $0-$10k revenue
        break;
      case 'conversion_rate':
        value = Math.random() * 10; // 0-10% conversion
        break;
      default:
        value = Math.random() * 100;
    }
    
    data.push({
      timestamp,
      value,
      metric,
      label: new Date(timestamp).toLocaleTimeString()
    });
  }
  
  return data;
};

// API data fetcher
export const fetchMetricData = async (url: string, metric: string) => {
  try {
    const response = await fetch(`${url}?metric=${metric}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch ${metric} from ${url}, using mock data`);
    return generateMockData(metric);
  }
};

// WebSocket connection for real-time updates
export class WebSocketDataSource {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: (data: any) => void;
  
  constructor(url: string, onMessage: (data: any) => void) {
    this.url = url;
    this.onMessage = onMessage;
  }
  
  connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected:', this.url);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected:', this.url);
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}