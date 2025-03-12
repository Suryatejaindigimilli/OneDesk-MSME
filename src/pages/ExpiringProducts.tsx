import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useExpiringProducts } from '../hooks/useExpiringProducts';
import { addDays, format, parseISO } from 'date-fns';

const ExpiringProducts: React.FC = () => {
  const navigate = useNavigate();
  const expiringProducts = useExpiringProducts() || [];
  
  // Group products by days until expiry
  const today = new Date();
  const groupedProducts = expiringProducts.reduce((acc, product) => {
    const expiryDate = parseISO(product.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (!acc[daysUntilExpiry]) {
      acc[daysUntilExpiry] = [];
    }
    
    acc[daysUntilExpiry].push(product);
    return acc;
  }, {} as Record<number, typeof expiringProducts>);
  
  // Sort by days until expiry
  const sortedGroups = Object.entries(groupedProducts)
    .map(([days, products]) => ({ days: parseInt(days), products }))
    .sort((a, b) => a.days - b.days);

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/inventory')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Expiring Products</h1>
      </div>
      
      {expiringProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-green-100">
              <AlertTriangle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">No Expiring Products</h2>
          <p className="text-gray-500">
            You don't have any products expiring in the next 30 days.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedGroups.map(({ days, products }) => (
            <div key={days} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className={`p-4 ${
                days <= 7 ? 'bg-red-50 border-b border-red-100' : 
                days <= 14 ? 'bg-amber-50 border-b border-amber-100' : 
                'bg-blue-50 border-b border-blue-100'
              }`}>
                <div className="flex items-center">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${
                    days <= 7 ? 'text-red-500' : 
                    days <= 14 ? 'text-amber-500' : 
                    'text-blue-500'
                  }`} />
                  <h2 className="text-lg font-medium">
                    {days === 0 ? 'Expiring Today' : 
                     days === 1 ? 'Expiring Tomorrow' : 
                     `Expiring in ${days} days`}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({format(addDays(today, days), 'MMM d, yyyy')})
                    </span>
                  </h2>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specifics
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        MRP
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.specifics}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{product.purchasePrice.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{product.mrp.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/inventory/return?id=${product.id}`)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Return
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpiringProducts;