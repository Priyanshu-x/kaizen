import React, { useState } from "react";
import { X } from "lucide-react";

export function EditTransactionModal({ transaction, onSave, onClose }) {
    const [editData, setEditData] = useState({
        ...transaction,
        amount: String(transaction.amount),
        tax: String(transaction.tax || ""),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(transaction._id, {
            ...editData,
            amount: Number(editData.amount),
            tax: Number(editData.tax || 0),
        });
    };

    const inputClasses = "w-full p-3 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all font-sans";
    const labelClasses = "text-xs font-medium text-muted-foreground uppercase";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card w-full max-w-md max-h-[85vh] overflow-y-auto p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200 custom-scrollbar">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-heading">Edit Transaction</h3>
                    <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className={labelClasses}>Date</label>
                        <input
                            type="date"
                            value={editData.date}
                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClasses}>Type</label>
                            <select
                                value={editData.type}
                                onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                className={inputClasses}
                                required
                            >
                                <option value="income">Income (Profit)</option>
                                <option value="expense">Expense (Loss)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={labelClasses}>Amount</label>
                            <input
                                type="number"
                                value={editData.amount}
                                onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                className={`${inputClasses} font-mono`}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={labelClasses}>Tax / Charges</label>
                        <input
                            type="number"
                            value={editData.tax}
                            onChange={(e) => setEditData({ ...editData, tax: e.target.value })}
                            placeholder="0.00"
                            className={`${inputClasses} font-mono`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={labelClasses}>Strategy / Source</label>
                        <input
                            type="text"
                            value={editData.source}
                            onChange={(e) => setEditData({ ...editData, source: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClasses}>Instrument</label>
                            <input
                                type="text"
                                value={editData.instrument || ""}
                                onChange={(e) => setEditData({ ...editData, instrument: e.target.value })}
                                className={inputClasses}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClasses}>Lot Size</label>
                            <input
                                type="text"
                                value={editData.lotSize || ""}
                                onChange={(e) => setEditData({ ...editData, lotSize: e.target.value })}
                                className={`${inputClasses} font-mono`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={labelClasses}>Notes</label>
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            rows="3"
                            className={`${inputClasses} resize-none`}
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
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
    );
}
