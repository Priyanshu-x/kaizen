import React, { useEffect } from 'react';
import JournalEntryForm from '../components/JournalEntryForm.jsx';
import JournalEntryDisplay from '../components/JournalEntryDisplay.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useJournal } from '../context/JournalContext.jsx';

const JournalPage = () => {
  const { isDarkMode } = useTheme();
  const { journalEntries, loading, error, fetchJournalEntries, deleteJournalEntry } = useJournal();

  useEffect(() => {
    fetchJournalEntries();
  }, []); // Fetch entries on component mount

  const handleDeleteEntry = async (id) => {
    try {
      await deleteJournalEntry(id);
    } catch (err) {
      alert('Failed to delete journal entry. Please try again.');
    }
  };

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-6">Journal Entries</h1>
      <JournalEntryForm />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Entries</h2>
        {loading ? (
          <p>Loading journal entries...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : journalEntries.length === 0 ? (
          <p>No journal entries yet. Start by writing one above!</p>
        ) : (
          journalEntries.map((entry) => (
            <JournalEntryDisplay key={entry._id} entry={entry} onDelete={handleDeleteEntry} />
          ))
        )}
      </div>
    </div>
  );
};

export default JournalPage;