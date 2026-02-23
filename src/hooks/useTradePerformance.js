import { useMemo } from "react";

export function useTradePerformance(transactions) {
    return useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return {
                totalNet: 0,
                totalGross: 0,
                totalCharges: 0,
                incomeTotal: 0,
                expenseTotal: 0,
                winRate: 0,
            };
        }

        let totalGross = 0;
        let totalCharges = 0;
        let incomeTotal = 0;
        let expenseTotal = 0;
        let wins = 0;

        transactions.forEach((t) => {
            const amount = Number(t.amount) || 0;
            const tax = Number(t.tax) || 0;

            totalGross += amount;
            totalCharges += tax;

            if (t.type === 'income') {
                incomeTotal += (amount - tax);
                if (amount > 0) wins++;
            } else {
                expenseTotal += (amount - tax);
            }
        });

        const totalNet = totalGross - totalCharges;
        const winRate = (wins / transactions.length) * 100;

        return {
            totalNet,
            totalGross,
            totalCharges,
            incomeTotal,
            expenseTotal,
            winRate,
        };
    }, [transactions]);
}
