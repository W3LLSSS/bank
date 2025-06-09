import { useCurrency } from '../context/CurrencyContext';

export const ChangeCurrency = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className='flex gap-2 bg-amber-600 p-2 rounded'>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as 'EUR' | 'USD')}
        className='bg-amber-600 text-white'
      >
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>
    </div>
  );
};
