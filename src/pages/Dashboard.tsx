import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { db } from '../db';
import { useExpiringProductsCount } from '../hooks/useExpiringProducts';

const Dashboard: React.FC = () => {
  const expiringCount = useExpiringProductsCount();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Get total products
      const products = await db.products.toArray();
      setTotalProducts(products.filter(p => !p.isReturned).length);
      
      // Get total sales
      const bills = await db.bills.toArray();
      const total = bills.reduce((sum, bill) => sum + bill.total, 0);
      setTotalSales(total);
      
      // Get last sync date
      const syncLogs = await db.syncLogs.orderBy('id').reverse().limit(1).toArray();
      if (syncLogs.length > 0) {
        setLastSyncDate(syncLogs[0].lastSynced);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await db.syncWithCloud();
      const syncLogs = await db.syncLogs.orderBy('id').reverse().limit(1).toArray();
      if (syncLogs.length > 0) {
        setLastSyncDate(syncLogs[0].lastSynced);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync with Cloud'}
        </button>
      </div>
      
      {lastSyncDate && (
        <div className="mb-6 text-sm text-gray-500 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Last synced: {new Date(lastSyncDate).toLocaleString()}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
              <p className="text-2xl font-semibold text-gray-800">{totalProducts}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/inventory" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View inventory →
            </Link>
          </div>
        </div>
        
        {/* Expiring Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Expiring Products</h2>
              <p className="text-2xl font-semibold text-gray-800">{expiringCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/inventory/expiring" 
              className="text-sm text-amber-600 hover:text-amber-800"
            >
              View expiring products →
            </Link>
          </div>
        </div>
        
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Sales</h2>
              <p className="text-2xl font-semibold text-gray-800">₹{totalSales.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/billing" 
              className="text-sm text-green-600 hover:text-green-800"
            >
              Create new bill →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/inventory/add" 
              className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <Package className="h-5 w-5 text-blue-600 mr-3" />
              <span>Add Product</span>
            </Link>
            <Link 
              to="/billing" 
              className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <ShoppingCart className="h-5 w-5 text-green-600 mr-3" />
              <span>New Bill</span>
            </Link>
            <Link 
              to="/inventory/return" 
              className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <RefreshCw className="h-5 w-5 text-purple-600 mr-3" />
              <span>Return Products</span>
            </Link>
            <Link 
              to="/inventory/expiring" 
              className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-3" />
              <span>Expiring Products</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cloud Sync</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {lastSyncDate ? 'Synced' : 'Not synced'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Application Version</span>
              <span className="text-gray-800">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;