import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { Percent, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const StudentDashboard = () => {
  const [stats, setStats] = useState({ totalDays: 0, present: 0, absent: 0, percentage: 100 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await api.get('/student/dashboard');
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching student stats', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    { title: 'Total Classes', value: stats.totalDays, icon: Percent, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Classes Attended', value: stats.present, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Classes Missed', value: stats.absent, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
  ];

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const isLow = Number(stats.percentage) < 75; // Let's use 75 as a generic visual reference here

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Dashboard</h2>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Stats'}</span>
        </button>
      </div>
      {isLow && (
         <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
             <div className="flex">
                 <div className="flex-shrink-0">
                     <XCircle className="h-5 w-5 text-red-500" />
                 </div>
                 <div className="ml-3">
                     <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Low Attendance Warning</h3>
                     <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                         <p>Your overall attendance is below the required threshold. Please go to the Requests section to submit documents if applicable, or contact your admin.</p>
                     </div>
                 </div>
             </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl ${stat.bg} dark:bg-opacity-20`}>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 border border-slate-100 dark:border-slate-700 mt-8 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Overall Attendance Score</h3>
        <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-100 dark:border-slate-700 flex items-center justify-center dashboard-ring shadow-inner">
           <div className={`absolute inset-0 rounded-full border-[16px] border-transparent`} style={{borderTopColor: isLow ? '#ef4444' : '#4f46e5', borderRightColor: isLow ? '#ef4444' : '#4f46e5', transform: `rotate(${Number(stats.percentage) * 3.6}deg)`}}></div>
           <div className="text-center z-10 bg-white dark:bg-slate-800 w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-md">
               <span className={`text-4xl font-bold ${isLow ? 'text-red-600' : 'text-indigo-600'}`}>{stats.percentage}%</span>
           </div>
        </div>
        <p className="mt-6 text-slate-500 dark:text-slate-400 text-sm max-w-md text-center">
            This represents your total presence across all marked subject days so far. 
        </p>
      </div>

    </div>
  );
};

export default StudentDashboard;
