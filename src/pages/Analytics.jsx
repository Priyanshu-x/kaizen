import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from "recharts";
import { MonthlyNetBalanceChart } from "../components/MonthlyNetBalanceChart";
import { getMonthlyNetBalances } from "../utils/transactionUtils";
import { useTransaction } from "../context/TransactionContext";
import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

export function Analytics() {
  const { transactions } = useTransaction();
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? "#E0E0E0" : "#333333";
  const gridColor = isDarkMode ? "#444444" : "#CCCCCC";
  const barFill = isDarkMode ? "#9F7AEA" : "#8884d8";
  const lineStroke = isDarkMode ? "#66BB6A" : "#8884d8";

  // Aggregate income and expenses by category
  const categoryData = useMemo(() => {
    const incomeMap = {};
    const expenseMap = {};
    transactions.forEach((t) => {
      const amount = parseFloat(String(t.amount || "0").replace("₹", ""));
      if (!isNaN(amount)) {
        const category = t.category || "Other";
        if (t.type === "income" && amount > 0) {
          incomeMap[category] = (incomeMap[category] || 0) + amount;
        } else if (t.type === "expense" && amount < 0) {
          expenseMap[category] = (expenseMap[category] || 0) + Math.abs(amount);
        }
      }
    });

    const allCategories = [...new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)])];
    return allCategories.map((category) => ({
      name: category,
      income: incomeMap[category] || 0,
      expense: expenseMap[category] || 0,
    }));
  }, [transactions]);

  // Aggregate P&L over time with chronological sorting
  const pnlTimeData = useMemo(() => {
    const monthMap = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (isNaN(date.getTime())) return;
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
      const amount = parseFloat(String(t.amount || "0").replace("₹", ""));
      if (!isNaN(amount)) {
        if (!monthMap[monthYear]) {
          monthMap[monthYear] = { income: 0, expense: 0 };
        }
        if (t.type === "income" && amount > 0) {
          monthMap[monthYear].income += amount;
        } else if (t.type === "expense" && amount < 0) {
          monthMap[monthYear].expense += Math.abs(amount);
        }
      }
    });

    return Object.keys(monthMap)
      .map((monthYear) => ({
        monthYear,
        income: monthMap[monthYear].income,
        expense: monthMap[monthYear].expense,
      }))
      .sort((a, b) => new Date(a.monthYear.split(" ")[1], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(a.monthYear.split(" ")[0])) - new Date(b.monthYear.split(" ")[1], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(b.monthYear.split(" ")[0])));
  }, [transactions]);

  const monthlyNetBalances = getMonthlyNetBalances(transactions);
 
  // Empty state
  if (transactions.length === 0 || !transactions.every((t) => t.date && t.amount && t.category && t.type)) {
    return (
      <div className="p-6 text-center dark:bg-gray-900 dark:text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Analytics</h2>
        <p className="text-gray-500 dark:text-gray-400">No valid transactions yet. Add some income entries to see analytics!</p>
      </div>
    );
  }
 
  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Analytics</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Income by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor }} />
            <YAxis stroke={textColor} tick={{ fill: textColor }} />
            <Tooltip
              contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#555" : "#ccc", color: textColor }}
              formatter={(value) => [`₹${value.toFixed(2)}`, "Income"]}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar dataKey="income" fill="#66BB6A" /> {/* Green for income */}
          </BarChart>
        </ResponsiveContainer>
      </div>
 
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor }} />
            <YAxis stroke={textColor} tick={{ fill: textColor }} />
            <Tooltip
              contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#555" : "#ccc", color: textColor }}
              formatter={(value) => [`₹${value.toFixed(2)}`, "Expense"]}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar dataKey="expense" fill="#EF5350" /> {/* Red for expense */}
          </BarChart>
        </ResponsiveContainer>
      </div>
 
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Profit & Loss Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pnlTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="monthYear" stroke={textColor} tick={{ fill: textColor }} />
            <YAxis stroke={textColor} tick={{ fill: textColor }} />
            <Tooltip
              contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#555" : "#ccc", color: textColor }}
              formatter={(value, name) => [`₹${value.toFixed(2)}`, name === "income" ? "Income" : "Expense"]}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar dataKey="income" stackId="a" fill="#66BB6A" /> {/* Green for income */}
            <Bar dataKey="expense" stackId="a" fill="#EF5350" /> {/* Red for expense */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <MonthlyNetBalanceChart data={monthlyNetBalances} />
      </div>
    </div>
  );
}