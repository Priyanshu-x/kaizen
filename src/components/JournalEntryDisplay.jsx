import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useTransaction } from '../context/TransactionContext.jsx';

const JournalEntryDisplay = ({ entry, onDelete }) => {
  const { isDarkMode } = useTheme();
  const { transactions } = useTransaction();

  const linkedTransactions = transactions.filter(transaction =>
    entry.linkedTransactionIds && entry.linkedTransactionIds.includes(transaction._id)
  );

  return (
    <div className={`p-4 shadow-md rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">{entry.title}</h3>
        <button
          onClick={() => onDelete(entry._id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
        >
          Delete
        </button>
      </div>
      <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{entry.date}</p>
      {linkedTransactions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Linked Trades/Income:</h4>
          <ul className="list-disc list-inside">
            {linkedTransactions.map(transaction => (
              <li key={transaction._id} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-1`}>
                <span className="font-medium">{new Date(transaction.date).toLocaleDateString()}</span> -
                <span className="font-medium"> {transaction.instrument || 'N/A'}</span>:
                <span className={`${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'} font-semibold`}> ₹{transaction.amount}</span> -
                {transaction.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className="prose max-w-none mt-4 journal-content"
        dangerouslySetInnerHTML={{ __html: entry.content }}
      />
    </div>
  );
};

export default JournalEntryDisplay;