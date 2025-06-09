import { ArrowLeftCircle, ArrowRightCircle, PlusCircle, Undo2, Settings, TrendingDown, TrendingUp } from "lucide-react"
import { formatMoney } from "../functions/formatted"
import type { Account } from "../types/account"
import { DepositModal } from "../functions/depositMoney"
import {  useMemo, useState } from "react"
import TransferModal from "./transferMoney"
import { getLastTransaction, RemoveTransaction, saveItem } from "../hooks/basics"
import { UndoTransaction } from "../functions/UndoTransaction"
import ExcelImporterExporter from "./ImportExportExcel"

export const AccountMovement = ({account, setAccount, currency, transactions, onRefresh}: {account: Account, setAccount: (acc: Account) => void, currency: any, transactions: any [], onRefresh: () => void}) => {
    const [activeModal, setActiveModal] = useState<null | 'deposit' | 'transfer' | 'repeat' | 'repeat_send' | 'repeat_transfer' | 'settings' | 'undo'>(null);
    const [selectedTransaction,  setSelectedTransaction]: any = useState();
    const [redo, setRedo] = useState(false);
    const [searchDescription, setSearchDescription] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");


    const filteredTransactions = useMemo(() => {return transactions
      .filter((tx) => {
        if (typeFilter === "deposit" && tx.type !== "deposit" && tx.type !== "transfer_receive") {
          return false;
        }
        
        if (typeFilter === "withdrawal" && tx.type !== "withdrawal" && tx.type !== "transfer_send") {
          return false;
        }
        
        if (typeFilter === "transfer" && tx.type !== "transfer_send" && tx.type !== "transfer_receive") {
          return false;
        }
        
        return true;        
      })
      .filter((tx) => {
        if (searchDescription && !tx.description.toLowerCase().includes(searchDescription.toLowerCase())) return false;
        return true;
      })
      .filter((tx) => {
        const txDate = new Date(tx.date);
        if (dateFrom && txDate < new Date(dateFrom)) return false;
        if (dateTo && txDate > new Date(dateTo)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, typeFilter, searchDescription, dateFrom, dateTo]);


    if (!account) {
        return null;
    }


    const actionButtons = [
        {
          icon: ArrowRightCircle,
          label: "Transfer",
          color: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
          shadowColor: "shadow-blue-500/25",
        },
        {
          icon: PlusCircle,
          label: "Deposit",
          color: "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
          shadowColor: "shadow-emerald-500/25",
        },
        {
          icon: Undo2,
          label: "Undo",
          color: "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
          shadowColor: "shadow-amber-500/25",
        },
        {
          icon: Settings,
          label: "Settings",
          color: "from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800",
          shadowColor: "shadow-slate-500/25",
        },
      ]

     

    return (
        <>
         <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 shadow-xl border border-slate-200/50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Transactions</h1>

                <div className="grid grid-cols-2 sm:flex gap-3">
                {actionButtons.map((button, index) => {
                    const Icon = button.icon
                    return (
                    <button
                        key={index}
                        className={`
                        flex items-center justify-center space-x-2 
                        bg-gradient-to-r ${button.color}
                        text-white px-4 py-2.5 rounded-xl 
                        shadow-lg ${button.shadowColor}
                        hover:shadow-xl hover:scale-105 
                        transition-all duration-200 ease-out
                        text-sm font-medium
                        border border-white/20
                        `}
                        onClick={async () => {
                          if (button.label === "Undo") {
                            await getLastTransaction(account).then((tx: any) => {UndoTransaction(account, tx); onRefresh();});
                          }
                          setActiveModal(button.label.toLowerCase() as any);
                        }}
                        
                        >
                        <Icon size={16} className="stroke-2" />
                        <span>{button.label}</span>
                    </button>
                    )
                })}
                
                </div>
            </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search description"
                    value={searchDescription}
                    onChange={(e) => setSearchDescription(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300"
                  />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="all">All Transactions</option>
                    <option value="deposit">Only Deposits</option>
                    <option value="withdrawal">Only Withdrawals</option>
                    <option value="transfer"> Only Transfers</option>
                  </select>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300"
                  />
                </div>
            
            
            {filteredTransactions.map((transactions: any, index: any) => (
              <div key={index} className="bg-white  mb-4 rounded-2xl p-6 shadow-lg border border-slate-200/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                    {transactions.type === "deposit" ? (
                        <>
                        <div className="p-2 bg-emerald-100 rounded-xl">
                            <TrendingUp className="text-emerald-600" size={20} />
                        </div>
                        <h2 className="font-bold text-lg text-emerald-600">Deposit</h2>
                        </>
                    ) : transactions.type === "transfer_send" ? (
                        <>
                        <div className="p-2 bg-blue-100 rounded-xl">
                            <ArrowRightCircle className="text-blue-600" size={20} />
                        </div>
                        <h2 className="font-bold text-lg text-blue-600">Transfer Sent</h2>
                        </>
                    ) : transactions.type === "transfer_receive" ? (
                        <>
                        <div className="p-2 bg-emerald-100 rounded-xl">
                            <ArrowLeftCircle className="text-emerald-600" size={20} />
                        </div>
                            <h2 className="font-bold text-lg text-emerald-600">Transfer Received</h2>
                        </>
                    ) : (
                        <>
                        <div className="p-2 bg-red-100 rounded-xl">
                            <TrendingDown className="text-red-600" size={20} />
                        </div>
                        <h2 className="font-bold text-lg text-red-600">Withdrawal</h2>
                        </>
                    )}
                      <div className="flex flex-1 flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 mt-2">

                        {transactions.type != "transfer_receive" ? (
                          <>
                          <button className="flex items-center justify-center space-x-2 
                          bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700
                          text-white px-4 py-2.5 rounded-xl 
                          shadow-lg shadow-emerald-400
                          hover:shadow-xl hover:scale-105 
                          transition-all duration-200 ease-out
                          text-sm font-medium
                          border border-white/20
                          "
                          onClick={async () => {
                            setSelectedTransaction(transactions);
                            onRefresh();
                            if(transactions.type === "deposit") {
                              setSelectedTransaction(transactions);
                              setActiveModal('repeat_send');
                            } else {
                              
                              setActiveModal('repeat_transfer');
                            }}}>
                          Edit
                        </button>
                        <button className="flex items-center justify-center space-x-2 
                          bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700
                          text-white px-4 py-2.5 rounded-xl 
                          shadow-lg shadow-yellow-400
                          hover:shadow-xl hover:scale-105 
                          transition-all duration-200 ease-out
                          text-sm font-medium
                          border border-white/20
                        "
                          onClick={async () => {
                            setSelectedTransaction(transactions);
                            onRefresh();
                            setRedo(true);
                            if(transactions.type === "deposit") {
                              setSelectedTransaction(transactions);
                              setActiveModal('repeat_send');
                            } else {
                              
                              setActiveModal('repeat_transfer');
                            }}}>
                          Redo
                        </button>
                              </>
                        ) : null}                        
                        <button className="flex items-center justify-center space-x-2 
                          bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                          text-white px-4 py-2.5 rounded-xl 
                          shadow-lg shadow-red-400
                          hover:shadow-xl hover:scale-105 
                          transition-all duration-200 ease-out
                          text-sm font-medium
                          border border-white/20
                        "
                        onClick={async () => {
                          await RemoveTransaction(transactions.date);
                          onRefresh();   
                        }}>
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 text-lg">{transactions.description}</span>
                        <span className="text-slate-500 text-sm">
                            {new Date(transactions.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            })}
                        </span>
                        </div>

                        <div className="flex flex-col sm:items-end">
                        <span
                            className={`text-xl font-bold ${transactions.type === "deposit" ? "text-emerald-600" : transactions.type === "transfer_receive" ? "text-emerald-600" : "text-red-600"}`}
                        >
                            {transactions.type === "deposit" || transactions.type === "transfer_receive" ? "+" : "-"}
                            {formatMoney(transactions.amount, currency)}
                        </span>
                        <span className="text-slate-500 text-sm">Balance: {formatMoney(transactions.lastBalance, currency)}</span>
                        </div>
                    </div>
                    </div>
                </div>  
            ))}
            </div>
            {activeModal === 'deposit' && (
                <DepositModal
                    account={account}
                    onDeposit={() => {
                    setActiveModal(null);
                    onRefresh();
                    }}
                    onClose={() => setActiveModal(null)}
                />
            ) }
            {activeModal === 'transfer' && (
                <TransferModal
                    account={account}
                    onTransfer={(updatedAccount) => {
                    setAccount(updatedAccount);
                    onRefresh();
                    }}
                    onClose={() => setActiveModal(null)}
                />
            ) }
            {activeModal === 'repeat_send' && (
                <DepositModal
                    account={account}
                    isRedo={redo}
                    selectedTransaction={selectedTransaction}
                    onDeposit={() => {
                    onRefresh();
                    setActiveModal(null);
                    setRedo(false);
                    }}
                    onClose={() => {setActiveModal(null); setRedo(false)}}
                />
            ) }
            {activeModal === 'repeat_transfer' && (
                <TransferModal
                account={account}
                selectedTransaction={selectedTransaction}
                isRedo={redo}
                onTransfer={(updatedAccount) => {
                setAccount(updatedAccount);
                onRefresh();
                setRedo(false);
                setActiveModal(null);
                }}
                onClose={() => {setActiveModal(null); setRedo(false)}}
                />
            )}
            {activeModal === 'settings' && (
              <ExcelImporterExporter
                transactions={filteredTransactions as any[]}
                onImport={async (transactions) => {
                  await Promise.all(
                    transactions.map(tx => saveItem('transactions', tx))
                  );
                setActiveModal(null);
                  onRefresh();
                }}                
                onClose={() => {setActiveModal(null); onRefresh();}}
                />
            )}
      </>
    )
}