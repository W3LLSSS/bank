
 export  const formatMoney = (amountEuro: number, currency: "EUR" | "USD") => {
    const exchangeRates = {
      EUR: 1,
      USD: 1.14,
    };
    const converted:any = amountEuro * exchangeRates[currency];
    return new Intl.NumberFormat(currency === 'EUR' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency,
    }).format(converted);
  };
  
  

export function toLocalDatetimeString(date: Date) {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

