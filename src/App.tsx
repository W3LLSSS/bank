
import './App.css'
import { Header } from './components/Header';
import { AccountBalance } from './components/accountBalance';
import { useEffect, useState } from 'react';
import { getAccounts, getTransactions } from './hooks/basics';
import type { Account } from './types/account';
import { AccountMovement } from './components/accountMovement';
import { useCurrency } from './context/CurrencyContext';

// App.tsx

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | any>(null);
  const [transactions, setTransactions] = useState<any>([]);
  const {currency} = useCurrency();


  const refreshAccounts = async () => {
    if(selectedAccount) {
      const transactions = await getTransactions(selectedAccount);
      setTransactions(transactions);
    }
    const accounts = await getAccounts();
    setAccounts(accounts);
    setSelectedAccount(accounts.find(a => a.accountNumber === selectedAccount?.accountNumber));
    console.log(accounts, selectedAccount);
  };
  
  useEffect(() => {
    refreshAccounts();

  }, []);
  
  
  useEffect(() => {
    const init = async () => {
      const accounts = await getAccounts();
      setAccounts(accounts);
    };
  
    init();
  }, []);
  
  useEffect(() => {
    const init = async () => {
      if (selectedAccount) {
        const transactions = await getTransactions(selectedAccount);
        setTransactions(transactions);
      }
    };
    init();
  }, [selectedAccount]);
  
  

  return (
    <div className="h-screen flex flex-col bg-neutral text-gray-900 font-sans">
     <Header />
      <main className="flex-1 overflow-y-auto p-4 pb-[5rem] md:pb-4">
        <div className="max-w-7xl mx-auto space-y-4">
          
          <div className={`p-4 ${accounts.length > 1 ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
              {accounts.map((account, index) => (
                <AccountBalance key={index} account={account} currency={currency} onSelect={setSelectedAccount}/>
              ))}
          </div>
          <div className="p-4 space-y-4">
            {selectedAccount && <AccountMovement account={selectedAccount} setAccount={setSelectedAccount} currency={currency} transactions={transactions} onRefresh={refreshAccounts}/>}
          </div>
        </div>
      </main>
    </div>
  );
}


