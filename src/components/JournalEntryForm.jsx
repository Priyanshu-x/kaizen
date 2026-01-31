import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6
import { useTheme } from '../context/ThemeContext.jsx';
import { useTransaction } from '../context/TransactionContext.jsx';
import { useJournal } from '../context/JournalContext.jsx';

const JournalEntryForm = () => {
  const { isDarkMode } = useTheme();
  const { transactions, loading, error } = useTransaction();
  const { addJournalEntry } = useJournal();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Default to current date
  const [content, setContent] = useState('');
  const [selectedTradeDate, setSelectedTradeDate] = useState(''); // New state for trade date filter
  const [linkedTransactionIds, setLinkedTransactionIds] = useState([]);
  const [showReflectionQuestions, setShowReflectionQuestions] = useState(false);

  const reflectionQuestions = [
    "Did I follow my plan?",
    "What emotion drove me most?",
    "What mistakes did I make?",
    "What can I do better next time?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Title and content cannot be empty.');
      return;
    }
    try {
      await addJournalEntry({ title, date, content, linkedTransactionIds });
      setTitle('');
      setDate(new Date().toISOString().slice(0, 10));
      setContent('');
      setSelectedTradeDate('');
      setLinkedTransactionIds([]);
    } catch (err) {
      // Error handling is done in context, but can add more specific UI feedback here if needed
      alert('Failed to save journal entry. Please try again.');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const inputClasses = "w-full p-3 rounded-xl bg-secondary/30 border border-transparent focus:border-black/50 dark:focus:border-white/50 focus:ring-0 transition-all outline-none";
  const labelClasses = "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 ml-1";

  return (
    <form onSubmit={handleSubmit} className="p-6 glass-card rounded-2xl">
      <div className="mb-4">
        <label htmlFor="title" className={labelClasses}>Title:</label>
        <input
          type="text"
          id="title"
          className={inputClasses}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className={labelClasses}>Date:</label>
        <input
          type="date"
          id="date"
          className={inputClasses}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="tradeDate" className={labelClasses}>
          Select Trade Date:
        </label>
        <input
          type="date"
          id="tradeDate"
          className={inputClasses}
          value={selectedTradeDate}
          onChange={(e) => {
            setSelectedTradeDate(e.target.value);
            setLinkedTransactionIds([]); // Clear selections when date changes
          }}
        />
      </div>

      {selectedTradeDate && (
        <div className="mb-4">
          <label htmlFor="linkedTransactions" className={labelClasses}>
            Trades for {selectedTradeDate}:
          </label>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading transactions...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <select
              id="linkedTransactions"
              multiple
              className={`${inputClasses} h-32`}
              value={linkedTransactionIds}
              onChange={(e) =>
                setLinkedTransactionIds(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {transactions
                .filter(
                  (transaction) =>
                    new Date(transaction.date).toISOString().slice(0, 10) === selectedTradeDate
                )
                .map((transaction) => (
                  <option key={transaction._id} value={transaction._id}>
                    {transaction.description} - {transaction.amount} ({transaction.instrument})
                  </option>
                ))}
            </select>
          )}
          <p className="text-xs mt-1 text-muted-foreground">
            Hold Ctrl (or Cmd on Mac) to select multiple items.
          </p>
        </div>
      )}

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="toggleReflection"
          className="mr-2 h-4 w-4 bg-transparent border-muted-foreground/30 rounded focus:ring-0 checked:bg-white checked:border-white"
          checked={showReflectionQuestions}
          onChange={() => setShowReflectionQuestions(!showReflectionQuestions)}
        />
        <label htmlFor="toggleReflection" className="text-sm font-medium text-foreground">
          Show Reflection Questions
        </label>
      </div>

      {showReflectionQuestions && (
        <div className="mb-4 p-4 rounded-xl bg-secondary/20 border border-white/5">
          <h3 className="text-md font-bold mb-2 text-foreground">Reflection Prompts:</h3>
          <ul className="list-disc list-inside space-y-1">
            {reflectionQuestions.map((question, index) => (
              <li key={index} className="text-muted-foreground text-sm">{question}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <label className={labelClasses}>Content:</label>
        <div className="rounded-xl overflow-hidden border border-white/10">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className="text-foreground bg-transparent"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-white text-black hover:bg-gray-200 dark:bg-white dark:text-black font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-white/10"
      >
        Save Entry
      </button>
    </form>
  );
};

export default JournalEntryForm;