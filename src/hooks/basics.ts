import { getDB, type StoreName } from '../db/db';
import type { Account } from '../types/account';

export const saveItem = async <T>(store: StoreName, item: T) => {
  const db = await getDB();
  await db.put(store, item);
};

export const getAllItems = async <T>(store: StoreName): Promise<T[]> => {
  const db = await getDB();
  return db.getAll(store);
};

export const getItem = async <T>(store: StoreName, id: string): Promise<T | undefined> => {
  const db = await getDB();
  return db.get(store, id);
}

export const deleteItem = async (store: StoreName, id: string) => {
  const db = await getDB();
  await db.delete(store, id);
};

export const clearStore = async (store: StoreName) => {
  const db = await getDB();
  await db.clear(store);
};

export const getAccounts = async () => {
  const db = await getDB();
  return db.getAll('accounts');
};

export const getTransactions = async (account: Account) => {
  const db = await getDB();
  const data = await db.getAll('transactions');

  const filtered = data.filter(
    (t) => t.accountId === account.accountNumber || t.recipient === account.accountNumber
  );

  filtered.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return filtered.slice(0, 20);
};

export const getLastTransaction = async (account: Account) => {
  const transactions = await getTransactions(account);
  if (transactions.length === 0) return null;
  return transactions[0];
};


export const setTransaction = async (accountNumber: any, amount: any) => {
  const accounts = await getAccounts();
  const updatedAccounts = accounts.map(account => {
    if (account.accountNumber === accountNumber) {
      return { ...account, balance: account.balance + amount };
    }
    return account;
  });

  for (const account of updatedAccounts) {
    await saveItem("accounts", account);
  }

  return true;
};



export const getIdTransaction = async (date: any) => {
  const db = await getDB();
  const transactions = await db.getAll('transactions');
  const match = transactions.find((t) => t.date === date);
  return match?.id; 
};

export const RemoveTransaction = async (date: any) => {
  if (!date) return false;
  const id = await getIdTransaction(date);
  if (!id) return false;
  await deleteItem("transactions", id);
  return true;
};
