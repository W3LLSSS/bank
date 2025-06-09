import { openDB, type IDBPDatabase } from 'idb';

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
};

export type Account = {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
};

export type Card = {
  id: string;
  holderName: string;
  number: string;
  expiry: string;
};

const DB_NAME = 'bankDB';
const DB_VERSION = 1;

let db: IDBPDatabase | null = null;

export const STORE_NAMES = ['accounts', 'transactions', 'cards'] as const;
export type StoreName = typeof STORE_NAMES[number];

export const getDB = async (): Promise<IDBPDatabase> => {
    if (db) return db;
  
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(database, oldVersion, _newVersion, transaction) {
        if (!database.objectStoreNames.contains('accounts')) {
          database.createObjectStore('accounts', { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains('transactions')) {
          database.createObjectStore('transactions', { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains('cards')) {
          database.createObjectStore('cards', { keyPath: 'id' });
        }
  
        if (oldVersion === 0) {
          const accountStore = transaction.objectStore('accounts');
          accountStore.add({
            id: 'default-account-id',
            accountNumber: '123456789',
            accountType: 'normal',
            balance: 10000,
            currency: 'EUR',
          });
        }
      },
    });
  
    return db;
  };
  
