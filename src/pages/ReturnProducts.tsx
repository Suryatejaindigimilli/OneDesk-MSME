import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Save } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Product } from '../db';

const ReturnProducts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedId = queryParams.get('id');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    preselectedId ? parseInt(preselectedId) : null
  );
  const [returnAmount, setReturnAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const products = useLiveQuery(
    () => db.products
      .filter(product => !product.isReturned)
      .toArray()
      .then(products => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return products.filter(
            p => p.name.toLowerCase().includes(term) || 
                 p.specifics.toLowerCase().includes(term)
          );
        }
        return products;
      }),
    [searchTerm]
  ) || [];
  
  const selectedProduct = useLiveQuery(
    () => selectedProductId ? db.products.get(selectedProductId) : null,
    [selectedProductId]
  );
  
  // Calculate the expected return amount (purchase price - discount)
  const expectedReturnAmount = selectedProduct 
    ? (selectedProduct.purchasePrice - selectedProduct.discount) * selectedProduct.quantity
    : 0;
  
  useEffect(() => {
    if (selectedProduct) {
      setReturnAmount(expectedReturnAmount);
    }
  }, [selectedProduct, expectedReturnAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId) {
      alert('Please select a product to return');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await db.returnProduct(
        selectedProductId,
        new Date().toISOString(),
        returnAmount
      );
      
      navigate('/inventory');
    } catch (error) {
      console.error('Error returning product:', error);
      alert('Failed to return product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/inventory')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Return Products</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Select Product</h2>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-md">
            {products.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {products.map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => setSelectedProductId(product.id!)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                        selectedProductId === product.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.specifics}</div>
                      <div className="mt-1 flex justify-between text-sm">
                        <span>Qty: {product.quantity}</span>
                        <span>MRP: ₹{product.mrp.toFixed(2)}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Return Details</h2>
          
          {selectedProduct ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Product Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specifics</p>
                    <p>{selectedProduct.specifics || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p>{selectedProduct.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Purchase Date</p>
                    <p>{new Date(selectedProduct.purchaseDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p>{new Date(selectedProduct.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Purchase Price</p>
                    <p>₹{selectedProduct.purchasePrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Discount</p>
                    <p>₹{selectedProduct.discount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">MRP</p>
                    <p>₹{selectedProduct.mrp.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="expectedReturnAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Return Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="text"
                    id="expectedReturnAmount"
                    value={expectedReturnAmount.toFixed(2)}
                    readOnly
                    className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Calculated as: (Purchase Price - Discount) × Quantity
                </p>
              </div>
              
              <div className="mb-8">
                <label htmlFor="returnAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Return Amount*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    id="returnAmount"
                    min="0"
                    step="0.01"
                    value={returnAmount}
                    onChange={(e) => setReturnAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {returnAmount < expectedReturnAmount && (
                  <p className="mt-1 text-sm text-amber-600">
                    This amount is less than the expected return amount.
                  </p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/inventory')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-4 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Processing...' : 'Process Return'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a product from the list to process a return
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnProducts;