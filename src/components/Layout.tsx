import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Settings, 
  AlertTriangle, 
  RotateCcw,
  LogOut
} from 'lucide-react';
import { useExpiringProductsCount } from '../hooks/useExpiringProducts';

const Layout: React.FC = () => {
  const expiringCount = useExpiringProductsCount();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">One Desktop Solution</h1>
          <p className="text-sm text-gray-500">One Smart Inc</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
            end
          >
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/inventory" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
            end
          >
            <Package className="h-5 w-5 mr-3" />
            Inventory
          </NavLink>
          
          <NavLink 
            to="/inventory/expiring" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <AlertTriangle className="h-5 w-5 mr-3" />
            Expiring Products
            {expiringCount > 0 && (
              <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {expiringCount}
              </span>
            )}
          </NavLink>
          
          <NavLink 
            to="/inventory/return" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <RotateCcw className="h-5 w-5 mr-3" />
            Return Products
          </NavLink>
          
          <NavLink 
            to="/billing" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <ShoppingCart className="h-5 w-5 mr-3" />
            Billing
          </NavLink>
          
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;