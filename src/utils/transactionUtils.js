export const getMonthlyNetBalances = (transactions) => {
  const monthlyData = {};

  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-M format

    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = { income: 0, expense: 0 };
    }

    if (transaction.type === 'income') {
      monthlyData[yearMonth].income += Number(transaction.amount);
    } else if (transaction.type === 'expense') {
      monthlyData[yearMonth].expense += Number(transaction.amount);
    }
  });

  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    if (yearA !== yearB) return yearA - yearB;
    return monthA - monthB;
  });

  return sortedMonths.map(month => ({
    month: month,
    netBalance: monthlyData[month].income + monthlyData[month].expense,
  }));
};