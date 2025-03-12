import Dexie, { Table } from 'dexie';
import { addDays, isAfter, isBefore, parseISO } from 'date-fns';

// Define types for our database tables
export interface Product {
  id?: number;
  name: string;
  specifics: string;
  purchaseDate: string;
  quantity: number;
  purchasePrice: number;
  discount: number;
  mrp: number;
  expiryDate: string;
  isReturned?: boolean;
  returnDate?: string;
  returnAmount?: number;
}

export interface BillItem {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export interface Bill {
  id?: number;
  date: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
  customerPhone?: string;
}

export interface SyncLog {
  id?: number;
  lastSynced: string;
  status: 'success' | 'failed';
  details?: string;
}

class OneDesktopDB extends Dexie {
  products!: Table<Product>;
  bills!: Table<Bill>;
  syncLogs!: Table<SyncLog>;

  constructor() {
    super('OneDesktopDB');
    this.version(1).stores({
      products: '++id, name, specifics, purchaseDate, expiryDate, isReturned',
      bills: '++id, date, total, customerName, customerPhone',
      syncLogs: '++id, lastSynced, status'
    });
  }

  async getExpiringProducts(): Promise<Product[]> {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    
    return this.products
      .filter(product => {
        const expiryDate = parseISO(product.expiryDate);
        return !product.isReturned && 
               isAfter(expiryDate, today) && 
               isBefore(expiryDate, thirtyDaysFromNow);
      })
      .toArray();
  }

  async getExpiringProductsCount(): Promise<number> {
    const products = await this.getExpiringProducts();
    return products.length;
  }

  async returnProduct(
    productId: number, 
    returnDate: string, 
    returnAmount: number
  ): Promise<void> {
    await this.products.update(productId, {
      isReturned: true,
      returnDate,
      returnAmount
    });
  }

  async syncWithCloud(): Promise<void> {
    try {
      // This would be replaced with actual cloud sync logic
      console.log('Syncing with cloud...');
      
      // Log the sync attempt
      await this.syncLogs.add({
        lastSynced: new Date().toISOString(),
        status: 'success'
      });
    } catch (error) {
      console.error('Sync failed:', error);
      
      // Log the failed sync attempt
      await this.syncLogs.add({
        lastSynced: new Date().toISOString(),
        status: 'failed',
        details: error instanceof Error ? error.message : String(error)
      });
      
      throw error;
    }
  }
}

export const db = new OneDesktopDB();