import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export function AddIncomeForm({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    date: "",
    source: "",
    amount: "",
    category: "Trading",
    description: "",
  });
  const [error, setError] = useState("");

  const categories = ["Trading", "Freelancing", "Salary", "Gigs", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.source || !formData.amount) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    onAdd({ ...formData, amount: Number(formData.amount), date: formData.date, description: formData.description, type: "income" });
    onClose();
  };

  return (
    <motion.div
      className="glass-card p-4 sm:p-6 rounded-lg w-11/12 sm:w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg sm:text-xl font-bold mb-4">Add New Income</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        {/* Category selection removed, defaults to Trading */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 resize-y min-h-[72px]"
          ></textarea>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200 text-base sm:text-sm dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-base sm:text-sm dark:from-blue-700 dark:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600"
          >
            Add Income
          </button>
        </div>
      </form>
    </motion.div>
  );
}