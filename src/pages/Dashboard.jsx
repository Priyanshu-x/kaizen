import { StatsCard } from "../components/StatsCard";
import { TransactionTable } from "../components/TransactionTable";
import { useTransaction } from "../context/TransactionContext";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getMonthlyNetBalances } from "../utils/transactionUtils";

export function Dashboard() {
  const { transactions, updateTransaction, deleteTransaction, loading, error } = useTransaction();
  const { logout } = useAuth();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const netBalance = totalIncome + totalExpenses;
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const thisMonthIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => {
    const transactionMonth = new Date(t.date).toLocaleString('default', { month: 'short' });
    return transactionMonth === currentMonth ? sum + Number(t.amount) : sum;
  }, 0);
  const thisMonthExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => {
    const transactionMonth = new Date(t.date).toLocaleString('default', { month: 'short' });
    return transactionMonth === currentMonth ? sum + Number(t.amount) : sum;
  }, 0);

  const thisMonthNetBalance = thisMonthIncome + thisMonthExpenses;

  const stats = [
    { title: "Total Income", value: totalIncome, trend: 5.2, color: "bg-chart-1" },
    { title: "Total Expenses", value: Math.abs(totalExpenses), trend: -3.1, color: "bg-red-500" },
    { title: "Net Balance", value: netBalance, trend: 0, color: "bg-blue-500" },
    { title: "This Month Income", value: thisMonthIncome, trend: -1.8, color: "bg-chart-2" },
    { title: "This Month Expenses", value: thisMonthExpenses, trend: 4.5, color: "bg-red-700" },
    { title: "This Month Net Balance", value: thisMonthNetBalance, trend: 0, color: "bg-blue-700" },
    { title: "Top Source", value: "Trading", trend: 8.3, color: "bg-chart-3" },
  ];


  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Dashboard</h2>
      {loading && <p className="text-yellow-500">Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {stats.map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} trend={stat.trend} color={stat.color} />
        ))}
      </motion.div>
      <motion.div
        className="mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <TransactionTable />
      </motion.div>
    </div>
  );
}