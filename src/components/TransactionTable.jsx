import { useState } from "react";
import { useTransaction } from "../context/TransactionContext";
import { Edit2, Trash2, Search, Filter } from "lucide-react";
import { RuleBadge } from "./RuleBadge";
import { EditTransactionModal } from "./EditTransactionModal";

export function TransactionTable() {
  const { transactions, updateTransaction, deleteTransaction } = useTransaction();
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ date: "", source: "", amount: "", category: "", description: "", type: "" });



  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortColumn) {
      // Default Sort: Date DESC, then Entry Time DESC
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB - dateA;
      }
      const timeA = a.entryTime || "00:00";
      const timeB = b.entryTime || "00:00";
      return timeB.localeCompare(timeA);
    }

    if (["amount", "buyingPrice", "sellingPrice", "tax"].includes(sortColumn)) {
      return sortDirection === "asc"
        ? Number(a[sortColumn] || 0) > Number(b[sortColumn] || 0) ? 1 : -1
        : Number(a[sortColumn] || 0) < Number(b[sortColumn] || 0) ? 1 : -1;
    }
    return sortDirection === "asc"
      ? (a[sortColumn] || "") > (b[sortColumn] || "") ? 1 : -1
      : (a[sortColumn] || "") < (b[sortColumn] || "") ? 1 : -1;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const handleEdit = (id) => {
    const transactionToEdit = transactions.find(t => t._id === id);
    if (transactionToEdit) {
      setEditingIndex(id);
      setEditData({
        ...transactionToEdit,
        amount: String(transactionToEdit.amount),
        type: transactionToEdit.type,
      });
    }
  };

  const handleSaveEdit = (id, updatedData) => {
    updateTransaction(id, updatedData);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditData({ date: "", source: "", amount: "", category: "", description: "", type: "" });
  };

  // ... (getTypeBadge helper is fine)

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden mt-8 border border-border/50">
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-border/50">
          <h3 className="text-xl font-bold font-heading">Recent Transactions/Trades</h3>
          <div className="flex gap-2">
            {/* ... search/filter ... */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-secondary/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-none"
              />
            </div>
            <button className="p-2 bg-secondary/50 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/30">
              <tr>
                {["Date", "Instrument", "Lot Size", "Buy", "Sell", "Entry", "Exit", "Charges", "Rules", "Net P&L", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
                    onClick={() => {
                      const keyMap = {
                        "Date": "date", "Instrument": "instrument", "Lot Size": "lotSize",
                        "Buy": "buyingPrice", "Sell": "sellingPrice",
                        "Entry": "entryTime", "Exit": "exitTime", "Charges": "tax", "Rules": "ruleFollowed", "Net P&L": "amount"
                      };
                      header !== "Actions" && handleSort(keyMap[header] || header.toLowerCase());
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sortedTransactions.map((t) => (
                <tr key={t._id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{t.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{t.instrument || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{t.lotSize || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{t.buyingPrice ? `₹${t.buyingPrice}` : "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{t.sellingPrice ? `₹${t.sellingPrice}` : "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{t.entryTime || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{t.exitTime || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-red-500/80">{t.tax ? `₹${t.tax}` : "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <RuleBadge transaction={t} allTransactions={transactions} />
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold tracking-tight ${(Number(t.amount) - (Number(t.tax) || 0)) >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {(Number(t.amount) - (Number(t.tax) || 0)) >= 0 ? "+" : "-"}₹{Math.abs(Number(t.amount) - (Number(t.tax) || 0)).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(t._id)}
                        className="p-1.5 text-foreground hover:bg-secondary rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="p-1.5 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedTransactions.length === 0 && (
                <tr>
                  <td colSpan="11" className="px-6 py-12 text-center text-muted-foreground">
                    No transactions found. Start by adding one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingIndex !== null && (
        <EditTransactionModal
          transaction={transactions.find(t => t._id === editingIndex)}
          onSave={handleSaveEdit}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </>
  );
}