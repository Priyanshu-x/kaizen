import React, { useEffect } from 'react';
import JournalEntryForm from '../components/JournalEntryForm.jsx';
import JournalEntryDisplay from '../components/JournalEntryDisplay.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Skeleton } from "../components/ui/Skeleton";
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
    <div className={`container mx-auto p-4 min-h-screen bg-background text-foreground`}>
      <h1 className="text-3xl font-bold mb-6 font-heading">Journal Entries</h1>
      <JournalEntryForm />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Entries</h2>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl opacity-50" />
            <Skeleton className="h-40 w-full rounded-2xl opacity-40" />
            <Skeleton className="h-40 w-full rounded-2xl opacity-30" />
          </div>
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