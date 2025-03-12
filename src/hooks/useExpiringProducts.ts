import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Product } from '../db';

export function useExpiringProducts() {
  return useLiveQuery(() => db.getExpiringProducts(), []);
}

export function useExpiringProductsCount() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const getCount = async () => {
      const count = await db.getExpiringProductsCount();
      setCount(count);
    };
    
    getCount();
  }, []);
  
  return count;
}