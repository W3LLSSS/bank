import { deleteItem, saveItem } from "../hooks/basics";

export const UndoTransaction = async (account: any, transaction: any) => {
  if (!transaction && transaction.type === 'transfer_recieve') return false;   
  console.log(account);

  console.log(account, transaction);

  // Obtener la cuenta afectada
  if (!account) {
    console.error("Cuenta no encontrada para la transacción");
    return false;
  }

  // Ajustar balance según tipo de transacción
  switch (transaction.type) {
    case "deposit":
    case "transfer_receive":
      // Si la cuenta recibió dinero, al deshacerlo hay que restar
      account.balance -= transaction.amount;
      break;

    case "withdrawal":
    case "transfer_send":
      // Si la cuenta envió dinero, al deshacerlo hay que sumar
      account.balance += transaction.amount;
      break;

    default:
      console.warn("Tipo de transacción no soportado para deshacer");
      break;
  }

  // Actualizar balance
  account.lastBalance = account.balance;

  // Guardar cuenta actualizada
  await saveItem("accounts", account);

  // Borrar la transacción
  await deleteItem("transactions", transaction.id);

  return true;
};
