import { useEffect, useState } from "react";
import type { Account, Transaction } from "../types/account";
import { generateUUID } from "../functions/randomCodes";
import { getAccounts, getIdTransaction, saveItem } from "../hooks/basics";
import {  toLocalDatetimeString } from "../functions/formatted";

const TransferModal = ({ account, onClose, onTransfer, selectedTransaction , isRedo} :{ account: Account, onClose: () => void, onTransfer: (updatedAccount: Account) => void, selectedTransaction?: Transaction , isRedo?: boolean }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(toLocalDatetimeString(new Date()));
  const [description, setNote] = useState("");

  useEffect(() => {
    if (selectedTransaction) {
      setRecipient(selectedTransaction.accountId || "")
      setAmount(selectedTransaction.amount.toFixed(2))
      setNote(selectedTransaction.description || "")
    }
  }, [selectedTransaction])
  

  const handleTransfer = async () => {
    if (!recipient || !amount || !description) {
      alert("Por favor, complete todos los campos.");
      return;
    }
  
    const amountNum = Number(amount);
    const accounts = await getAccounts();
  
    const senderIndex = accounts.findIndex(a => a.accountNumber === account.accountNumber);
    const recipientIndex = accounts.findIndex(a => a.accountNumber === recipient);
  
    if (recipientIndex === -1) {
      alert("Cuenta de destino no encontrada");
      return;
    }
  
    const sender = accounts[senderIndex];
    const receiver = accounts[recipientIndex];
  
  if (selectedTransaction && !isRedo) {
  const originalRecipientIndex = accounts.findIndex(
    a => a.accountNumber === selectedTransaction.recipient
  );

  const originalReceiver = accounts[originalRecipientIndex];

  sender.balance += selectedTransaction.amount;
  sender.lastBalance = sender.balance;

  if (originalReceiver) {
    originalReceiver.balance -= selectedTransaction.amount;
    originalReceiver.lastBalance = originalReceiver.balance;
    await saveItem("accounts", originalReceiver);
  }
}
    sender.balance -= amountNum;
    sender.lastBalance = sender.balance;
  
    receiver.balance += amountNum;
    receiver.lastBalance = receiver.balance;

    await saveItem("accounts", sender);
    await saveItem("accounts", receiver);
    
    const transferDate = isRedo ? toLocalDatetimeString(new Date()) : (selectedTransaction?.date || date);
    const transferId = isRedo ? generateUUID() : (selectedTransaction?.id || generateUUID());
    const transferSendTx: any = {
      id: transferId,
      type: "transfer_send",
      amount: amountNum,
      date: transferDate,
      description,
      accountId: sender.accountNumber,
      recipient: receiver.accountNumber,
      lastBalance: sender.balance,
    };


    
    await saveItem("transactions", transferSendTx);
    
    const pairedReceiveTx = await getIdTransaction(transferDate);
    
    const receiveTx: Transaction = {
      id: pairedReceiveTx?.id || generateUUID(),
      type: "transfer_receive",
      amount: amountNum,
      date: transferDate,
      description,
      accountId: receiver.accountNumber,
      recipient: sender.accountNumber,
      lastBalance: receiver.balance,
    };
    
    await saveItem("transactions", receiveTx);    
    onTransfer(sender);
    return onClose();
    
  };
  
  
  

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/20 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 text-xl"
        >
          ×
        </button>
  
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">New transfer</h2>
          <p className="text-slate-600 text-sm">Desde: {account?.accountNumber}</p>
        </div>
  
        <form onSubmit={(e) => { e.preventDefault(); handleTransfer(); }} className="space-y-6">
          {/* Recipient */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reciever</label>
            <input
              type="text"
              placeholder="Number account"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-200 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
  
          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg font-medium">
                $
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-200 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
  
          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              placeholder="About the transfer"
              value={description}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-200 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-200 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

  
          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 outline-none"
            >
              Cancel transfer
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 outline-none"
            >
              Transfer money
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default TransferModal;
