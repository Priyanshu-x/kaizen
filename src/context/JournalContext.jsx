import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const JournalContext = createContext();

export const useJournal = () => {
  return useContext(JournalContext);
};

export const JournalProvider = ({ children }) => {
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/journal-entries` : "https://2money-backend.onrender.com/api/journal-entries";

  const fetchJournalEntries = useCallback(async () => {
    if (!user) {
      setJournalEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE_URL, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch journal entries: ${res.statusText}`);
      }
      const data = await res.json();
      setJournalEntries(data);
    } catch (err) {
      console.error("Error fetching journal entries:", err);
      setError("Could not load journal entries. Check backend or network.");
    } finally {
      setLoading(false);
    }
  }, [user, API_BASE_URL]);

  useEffect(() => {
    fetchJournalEntries();
  }, [fetchJournalEntries]);

  const addJournalEntry = async (newEntry) => {
    if (!user) return Promise.reject("User not authenticated");

    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) {
        throw new Error(`Failed to add journal entry: ${res.statusText}`);
      }
      const addedEntry = await res.json();
      setJournalEntries((prevEntries) => [...prevEntries, addedEntry]);
      return addedEntry;
    } catch (err) {
      console.error("Error adding journal entry:", err);
      setError("Could not add journal entry. Please try again.");
      throw err; // Re-throw to allow component to handle
    }
  };

  const deleteJournalEntry = async (id) => {
    if (!user) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to delete journal entry: ${res.statusText}`);
      }
      setJournalEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
    } catch (err) {
      console.error("Error deleting journal entry:", err);
      setError("Could not delete journal entry. Please try again.");
      throw err; // Re-throw to allow component to handle
    }
  };

  const value = {
    journalEntries,
    loading,
    error,
    fetchJournalEntries,
    addJournalEntry,
    deleteJournalEntry,
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};