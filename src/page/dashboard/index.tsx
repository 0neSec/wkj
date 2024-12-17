import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, DollarSign, PackageIcon,
  Menu, X
} from 'lucide-react';
import { productService } from '../../services/product/product.service';
import Sidebar from '../../component/sidebar';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [productCount, setProductCount] = useState(0);
  
  // Sample data for charts
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

  // Fetch product counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch product count
        const products = await productService.getAllProducts();
        setProductCount(products.length);
      } catch (error) {
        console.error('Failed to fetch counts', error);
      }
    };

    fetchCounts();
  }, []);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
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

              {/* Users Chart */}
              <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistik Pengguna</h3>
                <div className="h-60 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="active" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Pengguna Aktif"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="new" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Pengguna Baru"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Training Participants */}
              <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Peserta Pelatihan</h3>
                <div className="h-60 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trainingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar 
                        dataKey="participants" 
                        fill="#8B5CF6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
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