import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import ExpiringProducts from './pages/ExpiringProducts';
import ReturnProducts from './pages/ReturnProducts';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import { useExpiringProductsCount } from './hooks/useExpiringProducts';

function App() {
  const expiringCount = useExpiringProductsCount();
  const [showNotification, setShowNotification] = React.useState(false);

  React.useEffect(() => {
    // Check if this is the first time opening the app today
    const lastOpened = localStorage.getItem('lastOpened');
    const today = new Date().toDateString();
    
    if (lastOpened !== today && expiringCount > 0) {
      setShowNotification(true);
      localStorage.setItem('lastOpened', today);
    }
  }, [expiringCount]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {showNotification && expiringCount > 0 && (
          <div className="fixed top-4 right-4 bg-amber-50 border border-amber-200 p-4 rounded-lg shadow-lg z-50 max-w-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Expiring Products Alert</h3>
                <p className="text-amber-700 mt-1">
                  You have {expiringCount} product{expiringCount !== 1 ? 's' : ''} expiring in the next 30 days.
                </p>
                <div className="mt-3 flex justify-end">
                  <button 
                    onClick={() => setShowNotification(false)}
                    className="text-sm px-3 py-1.5 bg-white border border-amber-200 rounded-md text-amber-700 hover:bg-amber-50"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/add" element={<AddProduct />} />
            <Route path="inventory/expiring" element={<ExpiringProducts />} />
            <Route path="inventory/return" element={<ReturnProducts />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;