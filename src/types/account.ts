export type Account = {
    accountNumber: string;
    accountType: string;
    balance: number; // o `number` si lo vas a convertir
    currency: any;
    cards: object;
  };
  
  export type Transaction = {
    recipient?: string;
    id: string;
    accountId: string;
    amount: number; // positivo para ingreso, negativo para retiro
    description: string;
    lastBalance: number;
    date: string; // formato ISO (puedes usar new Date().toISOString())
    type: 'deposit' | 'withdrawal' | 'transfer' | 'repeat' | 'repeat_send' | 'repeat_transfer' | 'transfer_send' | 'transfer_receive';
  };
  