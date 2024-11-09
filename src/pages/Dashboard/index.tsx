import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, DollarSign, BookOpen, GraduationCap,
  TrendingUp, ArrowUpRight, ArrowDownRight, Menu, X
} from 'lucide-react';
import Sidebar from '../../component/includes/sidebar';
import Navbar from '../../component/includes/navbar';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  const statCards = [
    {
      title: 'Total Pengguna',
      value: '8,549',
      change: '+12.5%',
      trending: 'up',
      icon: Users,
      colorClass: 'bg-blue-50 text-blue-500'
    },
    {
      title: 'Pendapatan',
      value: 'Rp 245.6M',
      change: '+8.2%',
      trending: 'up',
      icon: DollarSign,
      colorClass: 'bg-green-50 text-green-500'
    },
    {
      title: 'Total Pelatihan',
      value: '126',
      change: '+18.7%',
      trending: 'up',
      icon: GraduationCap,
      colorClass: 'bg-purple-50 text-purple-500'
    },
    {
      title: 'Artikel',
      value: '342',
      change: '-4.3%',
      trending: 'down',
      icon: BookOpen,
      colorClass: 'bg-orange-50 text-orange-500'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row mt-24">
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
                      <div className="flex items-center">
                        {stat.trending === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${
                          stat.trending === 'up' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
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

              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terkini</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {[
                    {
                      title: 'Workshop Digital Marketing',
                      time: '2 jam yang lalu',
                      desc: '24 peserta baru mendaftar'
                    },
                    {
                      title: 'Artikel Baru',
                      time: '4 jam yang lalu',
                      desc: '"Tips Memulai Bisnis Online" telah dipublikasi'
                    },
                    {
                      title: 'Wisata Edukasi',
                      time: '6 jam yang lalu',
                      desc: '12 booking baru untuk Kampung Coklat'
                    },
                    {
                      title: 'Pelatihan Selesai',
                      time: '12 jam yang lalu',
                      desc: 'Workshop Social Media Marketing telah selesai'
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">{activity.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{activity.desc}</p>
                        <span className="text-xs text-gray-400 mt-1 block">{activity.time}</span>
                      </div>
                    </div>
                  ))}
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