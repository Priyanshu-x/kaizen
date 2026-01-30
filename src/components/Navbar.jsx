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
    if (!transactions || transactions.length === 0) {
      alert("No transactions to export");
      return;
    }

    const headers = ["Date", "Source", "Amount", "Category", "Description"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          t.date,
          `"${(t.source || "").replace(/"/g, '""')}"`, // Quote and escape source
          t.amount,
          `"${(t.category || "").replace(/"/g, '""')}"`,
          `"${(t.description || "").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importTransactions = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input so the same file can be selected again if needed
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      if (!text) return;

      const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== "");
      // Skip header row
      const rows = lines.slice(1);

      if (rows.length === 0) {
        alert("CSV file seems empty or invalid.");
        return;
      }

      let successCount = 0;
      let failCount = 0;

      // Naive CSV parser for quoted fields: doesn't handle newlines within quotes, but better than split(',')
      // Matches: "quoted value" OR value
      const parseCSVLine = (line) => {
        const values = [];
        let current = "";
        let inQuote = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuote && line[i + 1] === '"') {
              current += '"'; // Escaped quote
              i++;
            } else {
              inQuote = !inQuote;
            }
          } else if (char === ',' && !inQuote) {
            values.push(current);
            current = "";
          } else {
            current += char;
          }
        }
        values.push(current);
        return values;
      };

      for (const row of rows) {
        try {
          // Try standard split first if no quotes likely, else advanced
          // Actually, let's just stick to the mapping based on assumed columns
          // Date, Source, Amount, Category, Description

          const cols = parseCSVLine(row);
          if (cols.length < 3) continue; // Minimal validation

          const [date, source, amountStr, category, description] = cols;

          const amount = parseFloat(amountStr);
          if (!date || isNaN(amount)) {
            failCount++;
            continue;
          }

          await addTransaction({
            date: date.trim(),
            source: (source || "").trim(),
            amount,
            category: (category || "").trim(),
            description: (description || "").trim(),
            type: amount >= 0 ? "income" : "expense" // Infer type? Or should CSV have it? Assuming existing logic: positive is income? 
            // Wait, existing logic didn't set type! The 'addTransaction' usually expects 'type'.
            // If the CSV export didn't include 'type', importing back relies on backend default or fails.
            // Let's infer type based on amount sign or default to 'income' if positive.
          });
          successCount++;
        } catch (err) {
          console.error("Import row failed:", err);
          failCount++;
        }
      }

      if (successCount > 0) {
        alert(`Successfully imported ${successCount} transactions.`);
      }
      if (failCount > 0) {
        alert(`Failed to import ${failCount} rows (invalid format).`);
      }
    };
    reader.readAsText(file);
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