import React, { useState, useRef } from 'react';
import { Search, Plus, Trash2, Printer } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Product, Bill, BillItem } from '../db';

interface CartItem extends BillItem {
  name: string;
  specifics: string;
}

const Billing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const products = useLiveQuery(
    () => db.products.filter(product => !product.isReturned).toArray(),
    []
  ) || [];
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.length > 1) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.specifics.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };
  
  const addToCart = (product: Product) => {
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      updatedCart[existingItemIndex].total = 
        updatedCart[existingItemIndex].quantity * updatedCart[existingItemIndex].price;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([
        ...cart,
        {
          productId: product.id!,
          name: product.name,
          specifics: product.specifics,
          quantity: 1,
          price: product.mrp,
          discount: 0,
          total: product.mrp
        }
      ]);
    }
    
    // Clear search
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
    
    // Focus back on search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  const updateCartItem = (index: number, field: keyof CartItem, value: number) => {
    const updatedCart = [...cart];
    updatedCart[index][field] = value;
    
    // Recalculate total
    if (field === 'quantity' || field === 'price' || field === 'discount') {
      updatedCart[index].total = 
        updatedCart[index].quantity * updatedCart[index].price - updatedCart[index].discount;
    }
    
    setCart(updatedCart);
  };
  
  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };
  
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };
  
  const calculateTotalDiscount = () => {
    return cart.reduce((sum, item) => sum + item.discount, 0);
  };
  
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };
  
  const handleSubmit = async () => {
    if (cart.length === 0) {
      alert('Please add at least one product to the cart');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const billItems: BillItem[] = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        total: item.total
      }));
      
      const bill: Omit<Bill, 'id'> = {
        date: new Date().toISOString(),
        items: billItems,
        subtotal: calculateSubtotal(),
        discount: calculateTotalDiscount(),
        total: calculateTotal(),
        paymentMethod,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined
      };
      
      await db.bills.add(bill);
      
      // Update product quantities
      for (const item of cart) {
        const product = await db.products.get(item.productId);
        if (product) {
          await db.products.update(item.productId, {
            quantity: Math.max(0, product.quantity - item.quantity)
          });
        }
      }
      
      // Print the bill
      printBill();
      
      // Reset the form
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setPaymentMethod('cash');
      
      alert('Bill created successfully!');
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Failed to create bill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const printBill = () => {
    // In a real application, this would connect to a printer
    // For now, we'll just log to console
    console.log('Printing bill...');
    console.log({
      date: new Date().toISOString(),
      items: cart,
      subtotal: calculateSubtotal(),
      discount: calculateTotalDiscount(),
      total: calculateTotal(),
      paymentMethod,
      customerName,
      customerPhone
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Billing</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products by name or specifics..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        >
                          <div className="flex-grow">
                            <div className="font-medium">{product.name}</div>
                            {product.specifics && (
                              <div className="text-sm text-gray-500">{product.specifics}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{product.mrp.toFixed(2)}</div>
                            <div className="text-sm text-gray-500">
                              Qty: {product.quantity}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.length > 0 ? (
                    cart.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {item.specifics && (
                            <div className="text-xs text-gray-500">{item.specifics}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                              <span className="text-gray-500">₹</span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateCartItem(index, 'price', parseFloat(e.target.value) || 0)}
                              className="pl-6 w-20 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateCartItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-16 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                              <span className="text-gray-500">₹</span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.discount}
                              onChange={(e) => updateCartItem(index, 'discount', parseFloat(e.target.value) || 0)}
                              className="pl-6 w-20 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">₹{item.total.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No items in cart. Search for products to add.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Cash</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Card</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">UPI</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Bill Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">-₹{calculateTotalDiscount().toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="text-gray-800 font-medium">Total</span>
                <span className="text-xl font-bold">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || cart.length === 0}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              <Printer className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Processing...' : 'Complete & Print Bill'}
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              {cart.length > 0 ? (
                <span>{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</span>
              ) : (
                <span>Add items to cart to create a bill</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;