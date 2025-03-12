import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { db } from '../db';

const Settings: React.FC = () => {
  const [syncFrequency, setSyncFrequency] = useState('daily');
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  useEffect(() => {
    const fetchSyncSettings = async () => {
      // Get last sync date
      const syncLogs = await db.syncLogs.orderBy('id').reverse().limit(1).toArray();
      if (syncLogs.length > 0) {
        setLastSyncDate(syncLogs[0].lastSynced);
      }
      
      // Get sync frequency from localStorage
      const savedFrequency = localStorage.getItem('syncFrequency');
      if (savedFrequency) {
        setSyncFrequency(savedFrequency);
      }
    };
    
    fetchSyncSettings();
  }, []);
  
  const handleSyncFrequencyChange = (frequency: string) => {
    setSyncFrequency(frequency);
    localStorage.setItem('syncFrequency', frequency);
  };
  
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await db.syncWithCloud();
      const syncLogs = await db.syncLogs.orderBy('id').reverse().limit(1).toArray();
      if (syncLogs.length > 0) {
        setLastSyncDate(syncLogs[0].lastSynced);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Sync failed. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleSaveSettings = () => {
    localStorage.setItem('syncFrequency', syncFrequency);
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Cloud Sync Settings</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sync Frequency
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="manual"
                  checked={syncFrequency === 'manual'}
                  onChange={() => handleSyncFrequencyChange('manual')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Manual only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="daily"
                  checked={syncFrequency === 'daily'}
                  onChange={() => handleSyncFrequencyChange('daily')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Daily (Recommended)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="hourly"
                  checked={syncFrequency === 'hourly'}
                  onChange={() => handleSyncFrequencyChange('hourly')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Hourly</span>
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Last Synced
              </label>
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-md text-gray-700">
              {lastSyncDate 
                ? new Date(lastSyncDate).toLocaleString() 
                : 'Never synced'}
            </div>
          </div>
          
          <button
            onClick={handleSaveSettings}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">About</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Application</h3>
              <p className="text-gray-900">OneDesk MSME</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">Version</h3>
              <p className="text-gray-900">1.0.0</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">Company</h3>
              <p className="text-gray-900">One Smart Inc</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">Support</h3>
              <p className="text-gray-900">support@onesmartinc.com</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">About One Desktop Solution</h3>
            <p className="text-sm text-blue-700">
              One Desktop Solution is a comprehensive inventory and billing management system designed for MSME shopkeepers. It allows you to manage your inventory, track expiring products, process returns, and create bills - all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
