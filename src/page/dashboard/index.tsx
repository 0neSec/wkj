import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, DollarSign, PackageIcon, Globe,
  Menu, X
} from 'lucide-react';
import { productService } from '../../services/product/product.service';
import Sidebar from '../../component/sidebar';
import { visitorService } from '../../services/visitor';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [visitorData, setVisitorData] = useState<any[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  
  // Sample data for existing charts
  const monthlyRevenue = [
    { name: 'Jan', amount: 4500 },
    { name: 'Feb', amount: 5200 },
    { name: 'Mar', amount: 4800 },
    { name: 'Apr', amount: 6300 },
    { name: 'May', amount: 5900 },
    { name: 'Jun', amount: 7500 }
  ];

  const userStats = [
    { month: 'Jan', active: 500, new: 120 },
    { month: 'Feb', active: 580, new: 150 },
    { month: 'Mar', active: 620, new: 180 },
    { month: 'Apr', active: 700, new: 190 },
    { month: 'May', active: 780, new: 220 },
    { month: 'Jun', active: 850, new: 250 }
  ];

  const trainingData = [
    { month: 'Jan', participants: 150 },
    { month: 'Feb', participants: 220 },
    { month: 'Mar', participants: 180 },
    { month: 'Apr', participants: 280 },
    { month: 'May', participants: 260 },
    { month: 'Jun', participants: 300 }
  ];

  // Fetch counts and visitors
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product count
        const products = await productService.getAllProducts();
        setProductCount(products.length);

        // Fetch visitor count
        const totalVisitors = await visitorService.getVisitorCount();
        setVisitorCount(totalVisitors);

        // Fetch all visitors and process for charts and recent list
        const allVisitors = await visitorService.getAllVisitors();
        
        // Prepare visitor data for monthly chart
        const processedVisitorData = processVisitorData(allVisitors);
        setVisitorData(processedVisitorData);

        // Get 10 most recent visitors
        const sortedVisitors = allVisitors
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10);
        setRecentVisitors(sortedVisitors);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, []);

  // Process visitor data for monthly chart
  const processVisitorData = (visitors: any[]) => {
    const monthMap = new Map();
    
    visitors.forEach(visitor => {
      const date = new Date(visitor.created_at);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    });

    return Array.from(monthMap, ([name, visitors]) => ({ name, visitors }));
  };

  const statCards = [
    {
      title: 'Total Pengguna',
      value: '8,549',
      icon: Users,
      colorClass: 'bg-blue-50 text-blue-500'
    },
    {
      title: 'Pendapatan',
      value: 'Rp 245.6M',
      icon: DollarSign,
      colorClass: 'bg-green-50 text-green-500'
    },
    {
      title: 'Produk',
      value: productCount.toString(),
      icon: PackageIcon,
      colorClass: 'bg-orange-50 text-orange-500'
    },
    {
      title: 'Total Kunjungan',
      value: visitorCount.toString(),
      icon: Globe,
      colorClass: 'bg-purple-50 text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row mt-10">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 mt-4 md:mt-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
              <select className="w-full sm:w-auto bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 12 months</option>
              </select>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {statCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <h3 className="text-xl lg:text-2xl font-semibold text-gray-800">
                        {stat.value}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.colorClass}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pendapatan Bulanan</h3>
                <div className="h-60 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#3B82F6" 
                        fill="#93C5FD"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Visitors Chart */}
              <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Kunjungan Bulanan</h3>
                <div className="h-60 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar 
                        dataKey="visitors" 
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                        name="Kunjungan"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Visitors Table */}
              <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">10 Kunjungan Terbaru</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">IP Address</th>
                        <th className="px-4 py-3">User Agent</th>
                        <th className="px-4 py-3">Waktu Kunjungan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentVisitors.map((visitor) => (
                        <tr key={visitor.id} className="border-b">
                          <td className="px-4 py-3">{visitor.ip_address}</td>
                          <td className="px-4 py-3 max-w-xs truncate">{visitor.user_agent}</td>
                          <td className="px-4 py-3">
                            {new Date(visitor.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;