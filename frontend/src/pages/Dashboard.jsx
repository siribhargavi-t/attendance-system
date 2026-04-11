import React from 'react';
import { Users, CheckCircle, Percent } from 'lucide-react';

// A reusable card component for the dashboard
const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105">
      <div className={`rounded-full p-3 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Dummy data for the dashboard cards
  const dummyData = {
    totalStudents: 150,
    todayAttendance: 135,
    overallPercentage: 90,
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      {/* Grid container for the cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Students Card */}
        <DashboardCard 
          title="Total Students" 
          value={dummyData.totalStudents}
          icon={<Users className="text-white" size={24} />}
          color="bg-blue-500"
        />

        {/* Today's Attendance Card */}
        <DashboardCard 
          title="Today's Attendance" 
          value={dummyData.todayAttendance}
          icon={<CheckCircle className="text-white" size={24} />}
          color="bg-green-500"
        />

        {/* Attendance Percentage Card */}
        <DashboardCard 
          title="Overall Percentage" 
          value={`${dummyData.overallPercentage}%`}
          icon={<Percent className="text-white" size={24} />}
          color="bg-orange-500"
        />

      </div>
      
      {/* Placeholder for future content */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Attendance Report</h2>
        <p className="text-gray-600 mt-2">Charts and detailed analytics will be displayed here.</p>
      </div>
    </div>
  );
};

export default Dashboard;