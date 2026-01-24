import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
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

  // Aggregate Daily P&L
  const dailyPnLData = useMemo(() => {
    const dailyMap = {};
    transactions.forEach((t) => {
      if (!t.date || !t.amount) return;
      const dateKey = t.date; // Assuming YYYY-MM-DD format from input
      const amount = parseFloat(String(t.amount).replace(/[^0-9.-]+/g, ""));

      if (!isNaN(amount)) {
        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = 0;
        }
        dailyMap[dateKey] += amount;
      }
    });

    return Object.keys(dailyMap)
      .map(date => ({
        date,
        pnl: dailyMap[date],
        formattedDate: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  // Aggregate Monthly P&L (existing logic preserved/optimized)
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

      {/* Daily P&L Chart */}
      <div className="mb-8 glass-card p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-bold mb-4 font-heading">Daily Net Profit & Loss</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyPnLData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
              <XAxis
                dataKey="formattedDate"
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
                tickLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
                  borderColor: isDarkMode ? "#333" : "#ccc",
                  color: textColor,
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
                formatter={(value) => [`₹${value.toFixed(2)}`, "Net P&L"]}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <ReferenceLine y={0} stroke={textColor} strokeOpacity={0.5} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {dailyPnLData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8 glass-card p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Monthly Income vs Expense</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pnlTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
            <XAxis dataKey="monthYear" stroke={textColor} tick={{ fill: textColor }} />
            <YAxis stroke={textColor} tick={{ fill: textColor }} />
            <Tooltip
              contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#555" : "#ccc", color: textColor, borderRadius: '8px' }}
              formatter={(value, name) => [`₹${value.toFixed(2)}`, name === "income" ? "Income" : "Expense"]}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar dataKey="income" name="Income" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
            <Bar dataKey="expense" name="Expense" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <MonthlyNetBalanceChart data={monthlyNetBalances} />
      </div>
    </div>
  );
}