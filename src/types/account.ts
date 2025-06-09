export type Account = {
    accountNumber: string;
    accountType: string;
    balance: number;
    currency: any;
    cards: object;
  };
  
  export type Transaction = {
    recipient?: string;
    id: string;
    accountId: string;
    amount: number;
    description: string;
    lastBalance: number;
    date: string;
    type: 'deposit' | 'withdrawal' | 'transfer' | 'repeat' | 'repeat_send' | 'repeat_transfer' | 'transfer_send' | 'transfer_receive';
  };
  