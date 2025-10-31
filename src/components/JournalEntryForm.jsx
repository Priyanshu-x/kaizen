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

  return (
    <form onSubmit={handleSubmit} className={`p-4 shadow-md rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="mb-4">
        <label htmlFor="title" className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title:</label>
        <input
          type="text"
          id="title"
          className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'text-gray-700 border-gray-300'}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date:</label>
        <input
          type="date"
          id="date"
          className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'text-gray-700 border-gray-300'}`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="tradeDate" className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Select Trade Date:
        </label>
        <input
          type="date"
          id="tradeDate"
          className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'text-gray-700 border-gray-300'}`}
          value={selectedTradeDate}
          onChange={(e) => {
            setSelectedTradeDate(e.target.value);
            setLinkedTransactionIds([]); // Clear selections when date changes
          }}
        />
      </div>

      {selectedTradeDate && (
        <div className="mb-4">
          <label htmlFor="linkedTransactions" className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Trades for {selectedTradeDate}:
          </label>
          {loading ? (
            <p>Loading transactions...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <select
              id="linkedTransactions"
              multiple
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'text-gray-700 border-gray-300'}`}
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
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Hold Ctrl (or Cmd on Mac) to select multiple items.
          </p>
        </div>
      )}

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="toggleReflection"
          className="mr-2 leading-tight"
          checked={showReflectionQuestions}
          onChange={() => setShowReflectionQuestions(!showReflectionQuestions)}
        />
        <label htmlFor="toggleReflection" className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Show Reflection Questions
        </label>
      </div>

      {showReflectionQuestions && (
        <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="text-md font-bold mb-2">Reflection Prompts:</h3>
          <ul className="list-disc list-inside">
            {reflectionQuestions.map((question, index) => (
              <li key={index} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-1`}>{question}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Content:</label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          className={`${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white'}`}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Save Entry
      </button>
    </form>
  );
};

export default JournalEntryForm;