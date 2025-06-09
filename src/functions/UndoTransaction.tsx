import { deleteItem, saveItem } from "../hooks/basics";

export const UndoTransaction = async (account: any, transaction: any) => {
  if (!transaction && transaction.type === 'transfer_recieve') return false;   

  if (!account) {
    console.error("Cuenta no encontrada para la transacción");
    return false;
  }

  switch (transaction.type) {
    case "deposit":
    case "transfer_receive":
      account.balance -= transaction.amount;
      break;

    case "withdrawal":
    case "transfer_send":
      account.balance += transaction.amount;
      break;

    default:
      console.warn("Tipo de transacción no soportado para deshacer");
      break;
  }

  account.lastBalance = account.balance;
  await saveItem("accounts", account);
  await deleteItem("transactions", transaction.id);

  return true;
};
