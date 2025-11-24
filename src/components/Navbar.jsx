import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, Sun, Moon, UserCircle } from "lucide-react"; // Only keeping necessary icons
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useTransaction } from "../context/TransactionContext"; // Import useTransaction
import { AddIncomeForm } from "./AddIncomeForm"; // Import AddIncomeForm
import AddExpenseForm from "./AddExpenseForm"; // Import AddExpenseForm

export function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth(); // Destructure user from useAuth
  const { transactions, addTransaction } = useTransaction(); // Get transactions and addTransaction
  const [isAddIncomeFormOpen, setIsAddIncomeFormOpen] = useState(false);
  const [isAddExpenseFormOpen, setIsAddExpenseFormOpen] = useState(false); // State for expense form

  const handleAddIncomeClick = () => {
    setIsAddIncomeFormOpen(true);
  };

  const handleCloseAddIncomeForm = () => {
    setIsAddIncomeFormOpen(false);
  };

  const handleAddExpenseClick = () => { // Function to open expense form
    setIsAddExpenseFormOpen(true);
  };

  const handleCloseAddExpenseForm = () => { // Function to close expense form
    setIsAddExpenseFormOpen(false);
  };

  // Basic export to CSV (client-side)
  const exportTransactions = () => {
    const csv = [
      ["Date,Source,Amount,Category,Description"].join(","),
      ...transactions.map((t) => [t.date, t.source, t.amount, t.category, t.description].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Basic import from CSV (client-side, to be enhanced)
  const importTransactions = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split("\n").slice(1); // Skip header
        const newTransactions = rows
          .map((row) => {
            const [date, source, amount, category, description] = row.split(",");
            return date && source && amount && category ? { date, source, amount, category, description } : null;
          })
          .filter((t) => t);
        newTransactions.forEach((data) => addTransaction(data));
      };
      reader.readAsText(file);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side (empty for now, or could add logo/title) */}
        <div className="flex items-center">
          {/* You can add a logo or title here if needed */}
        </div>

        {/* Center: Action Buttons (conditionally rendered) */}
        {user && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleAddIncomeClick}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Add Income
            </button>
            <button
              onClick={handleAddExpenseClick} // Add expense button
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-md hover:from-red-600 hover:to-red-800 transition-all duration-200"
            >
              Add Expense
            </button>
            <button
              onClick={exportTransactions}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200"
            >
              Export CSV
            </button>
            <label className="px-4 py-2 bg-yellow-500 text-white rounded-md cursor-pointer hover:bg-yellow-600 transition-all duration-200">
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={importTransactions}
                className="hidden"
              />
            </label>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        )}

        {/* Right side: User Profile and Dark Mode Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <UserCircle className="h-8 w-8 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-gray-100 hidden md:block">Priyanshu</span>
            </div>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {isAddIncomeFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <AddIncomeForm onAdd={addTransaction} onClose={handleCloseAddIncomeForm} />
        </div>
      )}
      {isAddExpenseFormOpen && ( // Conditionally render AddExpenseForm
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <AddExpenseForm onClose={handleCloseAddExpenseForm} />
        </div>
      )}
    </nav>
  );
}