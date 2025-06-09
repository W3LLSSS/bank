import type React from "react"
import { useEffect, useState } from "react"
import { saveItem } from "../hooks/basics"
import type { Account, Transaction } from "../types/account"
import { generateUUID } from "./randomCodes"
import { toLocalDatetimeString } from "./formatted"

type Props = {
  account: Account
  onDeposit?: (updatedAccount: Account) => void
  onClose?: () => void
  selectedTransaction?: Transaction
  isRedo?: boolean
}

export const DepositModal = ({ account, onDeposit, onClose, selectedTransaction, isRedo }: Props) => {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(toLocalDatetimeString(new Date())); 
  
  const [error, setError] = useState("")

  useEffect(() => {
    if (selectedTransaction) {
      setAmount(selectedTransaction.amount.toFixed(2))
      setDescription(selectedTransaction.description || "")
      setDate(isRedo ? toLocalDatetimeString(new Date()) : new Date(selectedTransaction.date).toISOString().slice(0, 19))
    }
  }, [selectedTransaction])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const depositAmount = Number.parseFloat(amount)
  
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }
  
    let newAccount = { ...account }
  
    let newTransfer: Transaction = {
      id: isRedo ? generateUUID() : selectedTransaction?.id || generateUUID(),
      amount: depositAmount,
      accountId: account.accountNumber,
      description: description || "Deposit",
      type: "deposit",
      lastBalance: 0,
      date: isRedo ? toLocalDatetimeString(new Date()) : new Date(date).toISOString(),
    }
  
    if (isRedo) {
      newAccount.balance += depositAmount
      newTransfer.lastBalance = newAccount.balance
      newTransfer.date = toLocalDatetimeString(new Date())
    } else if (selectedTransaction) {
      const diff = depositAmount - selectedTransaction.amount
      newAccount.balance += diff
      newTransfer.lastBalance = newAccount.balance
      newTransfer.date = selectedTransaction.date
    } else {
      newAccount.balance += depositAmount
      newTransfer.lastBalance = newAccount.balance
    }
    
    await saveItem("transactions", newTransfer)
    await saveItem("accounts", newAccount)
    onDeposit?.(newAccount)
    onClose?.()
  }
  

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/20 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 text-xl"
        >
          ×
        </button>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">Make a Deposit</h2>
          <p className="text-slate-600 text-sm">Account: {account.accountNumber}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
            <input
              type="text"
              placeholder="Enter deposit description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-200 outline-none"
            >
              Make Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
