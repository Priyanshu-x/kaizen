import { motion } from "framer-motion";
import { StatsCard } from "../components/StatsCard";
import { TransactionTable } from "../components/TransactionTable";
import { ProfitLossChart } from "../components/ProfitLossChart";
import { MonthlyTrendChart } from "../components/MonthlyTrendchart";
import { useTransaction } from "../context/TransactionContext";
import { useAuth } from "../context/AuthContext";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

export function Dashboard() {
  const { transactions, loading, error } = useTransaction();
  const { user } = useAuth();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const netBalance = totalIncome - Math.abs(totalExpenses); // distinct expenses are usually negative or positive depending on storage, assuming stored as positive based on previous code.
  // Actually previous code: totalExpenses = ... reduce((sum, t) => sum + Number(t.amount), 0).
  // Expenses might be stored as positive numbers with type='expense'.

  const currentMonth = new Date().toLocaleString('default', { month: 'short' });

  // Calculate this month's stats
  const thisMonthTransactions = transactions.filter(t =>
    new Date(t.date).toLocaleString('default', { month: 'short' }) === currentMonth
  );

  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const stats = [
    {
      title: "Total Balance",
      value: netBalance,
      trend: 12.5,
      icon: Wallet
    },
    {
      title: "Monthly Income",
      value: thisMonthIncome,
      trend: 8.2,
      icon: TrendingUp
    },
    {
      title: "Monthly Expenses",
      value: thisMonthExpenses,
      trend: -5.4,
      icon: TrendingDown
    },
    {
      title: "Monthly Savings",
      value: thisMonthIncome + thisMonthExpenses,
      trend: 2.1,
      icon: DollarSign
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold font-heading w-fit">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "User"}. Here's your financial overview.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-xl mb-6">
          {error}
        </div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div key={index} variants={item}>
              <StatsCard
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                icon={stat.icon}
              />
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={item}>
            <ProfitLossChart transactions={transactions} />
          </motion.div>
          <motion.div variants={item}>
            <MonthlyTrendChart entries={transactions} />
          </motion.div>
        </div>

        {/* Transactions Section */}
        <motion.div variants={item}>
          <TransactionTable />
        </motion.div>
      </motion.div>
    </div>
  );
}