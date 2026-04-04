import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalPresentToday: 0, totalAbsentToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.stats);
      } catch (err) {
        console.error('Error fetching admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Present Today', value: stats.totalPresentToday, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Absent Today', value: stats.totalAbsentToday, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
  ];

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="space-y-6 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700 flex items-center space-x-4 hover:shadow-md transition-all">
              <div className={`p-4 rounded-xl ${stat.bg} dark:bg-opacity-20`}>
                <Icon className={`w-8 h-8 ${stat.color} dark:text-opacity-90`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700 mt-8 transition-colors">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {/* Add quick action buttons if needed */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
