import React, { useState } from "react";
import { X, Calendar, DollarSign, Type, FileText, Activity, Clock, Layers, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AddIncomeForm({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    date: "",
    source: "",
    amount: "",
    category: "Trading",
    description: "",
    instrument: "",
    lotSize: "",
    buyingPrice: "",
    sellingPrice: "",
    entryTime: "",
    exitTime: "",
    tax: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.source || !formData.amount) {
      setError("Please fill in the required fields (Date, Source, Profit).");
      return;
    }
    if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    onAdd({
      ...formData,
      amount: Number(formData.amount),
      date: formData.date,
      description: formData.description,
      type: "income"
    });
    onClose();
  };

  const inputClasses = "w-full p-3 pl-10 rounded-xl bg-secondary/30 border border-transparent focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-muted-foreground/50";
  const labelClasses = "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 ml-1";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl shadow-2xl border border-white/10"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/5 bg-background/40 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Log Profitable Trade
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Record your trading gains</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              {error}
            </motion.div>
          )}

          {/* Primary Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-primary"></span>
              Primary Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Profit Amount (P&L)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={`${inputClasses} font-mono font-bold text-green-500`}
                  />
                </div>
              </div>
            </div>
            {/* Tax Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div>
                <label className={labelClasses}>Tax / Charges</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
                  <input
                    type="number"
                    name="tax"
                    value={formData.tax}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={`${inputClasses} font-mono text-red-400`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/30" />

          {/* Trade Specifics Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-blue-500"></span>
              Trade Specifics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>Instrument Name</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="instrument"
                    value={formData.instrument}
                    onChange={handleChange}
                    placeholder="e.g. NIFTY 22000 CE"
                    className={`${inputClasses} uppercase`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Strategy / Source</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="e.g. Breakout, Scalp"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClasses}>Lot Size</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="lotSize"
                    value={formData.lotSize}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Buy Price</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    name="buyingPrice"
                    value={formData.buyingPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Sell Price</label>
                <div className="relative">
                  <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/30" />

          {/* Timing Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-purple-500"></span>
              Session Timing
            </h3>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>Entry Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="time"
                    name="entryTime"
                    value={formData.entryTime}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Exit Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="time"
                    name="exitTime"
                    value={formData.exitTime}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Notes / Analysis</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What went right?"
                rows="3"
                className={`${inputClasses} pl-10 resize-none`}
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg shadow-primary/25 transition-all duration-200"
            >
              Log Profit
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}