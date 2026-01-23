import { useState } from "react";
import { useTransaction } from "../context/TransactionContext";
import { Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, Search, Filter, CheckCircle, AlertTriangle } from "lucide-react";

export function TransactionTable() {
  const { transactions, updateTransaction, deleteTransaction } = useTransaction();
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ date: "", source: "", amount: "", category: "", description: "", type: "" });

  const getRuleStatus = (transaction) => {
    // 1. Find all trades for this specific date
    const sameDayTrades = transactions.filter(t => t.date === transaction.date);

    // 2. Sort them by time (Entry Time) to determine order
    sameDayTrades.sort((a, b) => {
      const timeA = a.entryTime || "00:00";
      const timeB = b.entryTime || "00:00";
      return timeA.localeCompare(timeB);
    });

    const index = sameDayTrades.findIndex(t => t._id === transaction._id);

    // Rule 1: Max 2 Trades per day
    if (index >= 2) return { followed: false, reason: "Violation: Max 2 trades/day limit exceeded" };

    // Rule 2: If 1st trade is a Loss, stop trading
    if (index > 0) {
      const firstTrade = sameDayTrades[0];
      if (firstTrade.type === "expense") {
        return { followed: false, reason: "Violation: First trade was a loss. Stop trading." };
      }
    }

    return { followed: true, reason: "Rules followed" };
  };

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

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedTransaction = {
        ...editData,
        amount: Number(editData.amount.replace(/[$₹]/g, "")),
        tax: Number(editData.tax || 0),
      };
      updateTransaction(editingIndex, updatedTransaction);
      setEditingIndex(null);
      setEditData({ date: "", source: "", amount: "", category: "", description: "" });
    }
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
                {["Date", "Instrument", "Lot Size", "Buy", "Sell", "Entry", "Exit", "Charges", "Rules", "P&L", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
                    onClick={() => {
                      const keyMap = {
                        "Date": "date", "Instrument": "instrument", "Lot Size": "lotSize",
                        "Buy": "buyingPrice", "Sell": "sellingPrice",
                        "Entry": "entryTime", "Exit": "exitTime", "Charges": "tax", "Rules": "ruleFollowed", "P&L": "amount"
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
                  <td className="px-4 py-3 whitespace-nowrap">
                    {(() => {
                      const status = getRuleStatus(t);
                      return status.followed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" title={status.reason} />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" title={status.reason} />
                      );
                    })()}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold tracking-tight ${t.amount >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {t.amount >= 0 ? "+" : "-"}₹{Math.abs(Number(t.amount)).toFixed(2)}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md max-h-[85vh] overflow-y-auto p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200 custom-scrollbar">
            <h3 className="text-xl font-bold font-heading mb-6">Edit Transaction</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">

              {/* Other inputs remain same... Adding Rule Checkbox */}

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Date</label>
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all font-sans"
                  required
                />
              </div>

              {/* ... Type, Amount ... */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Type</label>
                  <select
                    value={editData.type}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all"
                    required
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Amount</label>
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Tax / Charges</label>
                <input
                  type="number"
                  value={editData.tax || ""}
                  onChange={(e) => setEditData({ ...editData, tax: e.target.value })}
                  placeholder="0.00"
                  className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all font-mono"
                />
              </div>

              {/* ... Rest of inputs ... */}


              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Source</label>
                <input
                  type="text"
                  value={editData.source}
                  onChange={(e) => setEditData({ ...editData, source: e.target.value })}
                  placeholder="e.g. Salary, Client X"
                  className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all"
                  required
                />
              </div>

              {/* Trade Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Instrument</label>
                  <input
                    type="text"
                    value={editData.instrument || ""}
                    onChange={(e) => setEditData({ ...editData, instrument: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Lot Size</label>
                  <input
                    type="text"
                    value={editData.lotSize || ""}
                    onChange={(e) => setEditData({ ...editData, lotSize: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Buy Price</label>
                  <input
                    type="number"
                    value={editData.buyingPrice || ""}
                    onChange={(e) => setEditData({ ...editData, buyingPrice: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Sell Price</label>
                  <input
                    type="number"
                    value={editData.sellingPrice || ""}
                    onChange={(e) => setEditData({ ...editData, sellingPrice: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Entry Time</label>
                  <input
                    type="time"
                    value={editData.entryTime || ""}
                    onChange={(e) => setEditData({ ...editData, entryTime: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Exit Time</label>
                  <input
                    type="time"
                    value={editData.exitTime || ""}
                    onChange={(e) => setEditData({ ...editData, exitTime: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Add notes..."
                  rows="3"
                  className="w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg shadow-primary/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}