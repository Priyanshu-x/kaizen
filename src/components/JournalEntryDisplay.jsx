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
    <div className="p-6 glass-card rounded-2xl mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground font-heading">{entry.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{entry.date}</p>
        </div>
        <button
          onClick={() => onDelete(entry._id)}
          className="bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium py-1.5 px-3 rounded-lg text-sm transition-colors border border-destructive/20"
        >
          Delete
        </button>
      </div>
      {linkedTransactions.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-secondary/20 border border-white/5">
          <h4 className="text-sm font-semibold mb-2 text-foreground">Linked Trades/Income:</h4>
          <ul className="space-y-2">
            {linkedTransactions.map(transaction => (
              <li key={transaction._id} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                <span className="font-mono text-xs opacity-70">{new Date(transaction.date).toLocaleDateString()}</span>
                <span className="font-medium text-foreground"> {transaction.instrument || 'N/A'}</span>
                <span className={`${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                  {transaction.amount >= 0 ? '+' : ''}₹{transaction.amount}
                </span>
                <span className="opacity-80">- {transaction.description}</span>
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