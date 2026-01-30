import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://2money-backend.onrender.com";

  // Fetch transactions
  const fetchTransactions = useCallback(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/api/transactions`, {
      headers: {
        "Authorization": `Bearer ${user.token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      })
      .then((data) => {
        const parsedData = data.map(transaction => ({
          ...transaction,
          amount: Number(transaction.amount) || 0
        }));
        setTransactions(parsedData);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        setError("Could not load transactions. Check backend or network.");
      })
      .finally(() => setLoading(false));
  }, [user, API_URL]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Add a new transaction
  const addTransaction = (data) => {
    if (!user) return Promise.reject("User not authenticated");

    return fetch(`${API_URL}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add transaction");
        return res.json();
      })
      .then((newTransaction) => {
        setTransactions((prev) => [...prev, { ...newTransaction, amount: Number(newTransaction.amount) || 0, description: newTransaction.description || data.description || "", instrument: newTransaction.instrument || data.instrument || "" }]);
        return newTransaction;
      })
      .catch((err) => {
        console.error("Error adding transaction:", err);
        throw err;
      });
  };

  // Update an existing transaction
  const updateTransaction = (id, data) => {
    if (!user) return;

    fetch(`${API_URL}/api/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update transaction");
        return res.json();
      })
      .then((updatedTransaction) => {
        setTransactions((prev) =>
          prev.map((t) => (t._id === updatedTransaction._id ? { ...updatedTransaction, amount: Number(updatedTransaction.amount) || 0, description: updatedTransaction.description || data.description || "", instrument: updatedTransaction.instrument || data.instrument || "" } : t))
        );
      })
      .catch((err) => console.error("Error updating transaction:", err));
  };

  // Delete a transaction
  const deleteTransaction = (id) => {
    if (!user) return;

    fetch(`${API_URL}/api/transactions/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${user.token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete transaction");
        return res.json();
      })
      .then(() => {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      })
      .catch((err) => console.error("Error deleting transaction:", err));
  };

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, updateTransaction, deleteTransaction, loading, error }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransaction = () => useContext(TransactionContext);