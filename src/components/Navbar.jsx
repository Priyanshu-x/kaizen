import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, Sun, Moon, UserCircle, Plus, FileSpreadsheet, LogOut, Download, Upload } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useTransaction } from "../context/TransactionContext";
import { AddIncomeForm } from "./AddIncomeForm";
import AddExpenseForm from "./AddExpenseForm";

export function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const { transactions, addTransaction } = useTransaction();
  const [isAddIncomeFormOpen, setIsAddIncomeFormOpen] = useState(false);
  const [isAddExpenseFormOpen, setIsAddExpenseFormOpen] = useState(false);

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

  const importTransactions = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split("\n").slice(1);
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
    <>
      <nav className="glass-header sticky top-0 z-30 px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Breadcrumbs or Page Title could go here (mobile mainly) */}
          <div className="flex items-center md:hidden gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-heading">Kaizen</span>
          </div>

          <div className="hidden md:block">
            {/* Spacer or Breadcrumbs */}
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="flex items-center gap-2 mr-2">
                  <button
                    onClick={() => setIsAddIncomeFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm border border-primary/20"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Income</span>
                  </button>
                  <button
                    onClick={() => setIsAddExpenseFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all duration-300 font-medium text-sm border border-secondary"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Expense</span>
                  </button>
                </div>

                <div className="h-8 w-[1px] bg-border mx-2"></div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={exportTransactions}
                    className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-secondary transition-colors"
                    title="Export CSV"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <label className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-secondary transition-colors cursor-pointer" title="Import CSV">
                    <Upload className="h-5 w-5" />
                    <input
                      type="file"
                      accept=".csv"
                      onChange={importTransactions}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="h-8 w-[1px] bg-border mx-2"></div>
              </>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-secondary text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user && (
              <button
                onClick={logout}
                className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {isAddIncomeFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
          <AddIncomeForm onAdd={addTransaction} onClose={() => setIsAddIncomeFormOpen(false)} />
        </div>
      )}

      {isAddExpenseFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
          <AddExpenseForm onClose={() => setIsAddExpenseFormOpen(false)} />
        </div>
      )}
    </>
  );
}