import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
import MainLayout from "../../components/Layout/MainLayout";

const Settings = () => {
  const { darkMode } = useTheme();
  
  const [preferences, setPreferences] = useState({
    emailNotifs: true,
    pushNotifs: true,
    weeklyReports: false,
    publicProfile: true,
    language: "English"
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <MainLayout>
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-10 space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences and settings.</p>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Theme Mode</p>
              <p className="text-sm text-gray-500">Toggle between Light and Dark mode globally.</p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive alerts via email</p>
              </div>
              <button 
                onClick={() => handleToggle('emailNotifs')}
                className={`w-12 h-6 rounded-full transition-colors flex items-center ${preferences.emailNotifs ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.emailNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive alerts on your dashboard</p>
              </div>
              <button 
                onClick={() => handleToggle('pushNotifs')}
                className={`w-12 h-6 rounded-full transition-colors flex items-center ${preferences.pushNotifs ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.pushNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Security</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full border dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full border dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" />
            </div>
            <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg mt-2 hover:bg-blue-700 transition">Update Password</button>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Privacy</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Public Profile</p>
              <p className="text-sm text-gray-500">Allow others to see your information</p>
            </div>
            <button 
              onClick={() => handleToggle('publicProfile')}
              className={`w-12 h-6 rounded-full transition-colors flex items-center ${preferences.publicProfile ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.publicProfile ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Settings;
