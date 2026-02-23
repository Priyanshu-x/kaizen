import { motion } from "framer-motion";
import { StatsCard } from "../components/StatsCard";
import { TransactionTable } from "../components/TransactionTable";
import { ProfitLossChart } from "../components/ProfitLossChart";
import { MonthlyTrendChart } from "../components/MonthlyTrendchart";
import { useTransaction } from "../context/TransactionContext";
import { useAuth } from "../context/AuthContext";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Activity, IndianRupee } from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";
import { useTradePerformance } from "../hooks/useTradePerformance";

export function Dashboard() {
  const { transactions, loading, error } = useTransaction();
  const { user } = useAuth();

  const { totalNet } = useTradePerformance(transactions);
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });

  const thisMonthTransactions = transactions.filter(t =>
    new Date(t.date).toLocaleString('default', { month: 'short' }) === currentMonth
  );

  const { incomeTotal, expenseTotal, totalNet: monthlySavings } = useTradePerformance(thisMonthTransactions);

  const stats = [
    {
      title: "Total Balance",
      value: totalNet,
      trend: 12.5,
      icon: Wallet
    },
    {
      title: "Monthly Profit",
      value: incomeTotal,
      trend: 8.2,
      icon: TrendingUp
    },
    {
      title: "Monthly Losses",
      value: expenseTotal,
      trend: -5.4,
      icon: TrendingDown
    },
    {
      title: "Monthly Savings",
      value: monthlySavings,
      trend: 2.1,
      icon: IndianRupee
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
                loading={loading}
              />
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={item}>
            {loading ? (
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            ) : (
              <ProfitLossChart transactions={transactions} />
            )}
          </motion.div>
          <motion.div variants={item}>
            {loading ? (
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            ) : (
              <MonthlyTrendChart entries={transactions} />
            )}
          </motion.div>
        </div>

        {/* Transactions Section */}
        <motion.div variants={item}>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-[300px] w-full rounded-2xl" />
            </div>
          ) : (
            <TransactionTable />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}