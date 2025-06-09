import { AlertCircle, CreditCard, EyeOff, Eye } from "lucide-react"
import { useState } from "react"
import { formatMoney } from "../functions/formatted"
import type { Account } from "../types/account"

export const AccountBalance = ({account, currency, onSelect}: {account: Account, currency: any, onSelect: (Account: Account) => void}) => {
    const [showBalance, setShowBalance] = useState(true)

    if (!account) {
      return (
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 shadow-lg border border-slate-300/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <h4 className="text-lg font-semibold text-slate-700">Account Not Found</h4>
          </div>
  
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-400">€0.00</span>
              <span className="text-sm text-slate-500 mt-1">No account available</span>
            </div>
            <div className="px-3 py-1 bg-slate-200 rounded-lg">
              <span className="text-xs font-medium text-slate-600">EUR</span>
            </div>
          </div>
        </div>
      )
    }
  
    return (
      <div
        onClick={() => onSelect?.(account)}
        className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-emerald-200/50 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out group"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-200 rounded-xl group-hover:bg-emerald-300 transition-colors">
              <CreditCard className="text-emerald-700" size={20} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-emerald-800">Available Balance</h4>
              <p className="text-sm text-emerald-600">Primary Account</p>
            </div>
          </div>
  
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowBalance(!showBalance)
              }}
              className="p-2 hover:bg-emerald-200 rounded-lg transition-colors"
            >
              {showBalance ? (
                <EyeOff className="text-emerald-600" size={16} />
              ) : (
                <Eye className="text-emerald-600" size={16} />
              )}
            </button>
            <div className="px-3 py-1 bg-white/70 rounded-lg backdrop-blur-sm">
              <span className="text-xs font-medium text-emerald-700">****{account.accountNumber.slice(-4)}</span>
            </div>
          </div>
        </div>
  
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-emerald-900 tracking-tight">
              {showBalance ? formatMoney(account.balance, currency) : "••••••"}
            </span>
            <span className="text-sm text-emerald-600 mt-1">Account: {showBalance ? account.accountNumber : "••••••"}</span>
          </div>
  
          <div className="flex flex-col items-end gap-1">
            <div className="px-3 py-1 bg-emerald-200 rounded-lg">
              <span className="text-xs font-bold text-emerald-800">{currency}</span>
            </div>
            <span className="text-xs text-emerald-600">Currency</span>
          </div>
        </div>
  
        <div className="mt-4 pt-4 border-t border-emerald-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-600">Click to view details</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
}