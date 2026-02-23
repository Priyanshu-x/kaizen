/**
 * Centralized Trading Rules for Kaizen
 * These rules determine if a trade follows the pre-defined discipline.
 */

export const getRuleStatus = (transaction, allTransactions) => {
    if (!transaction || !allTransactions) return { followed: true, reason: "No data" };

    // 1. Find all trades for this specific date
    const sameDayTrades = allTransactions.filter(t => t.date === transaction.date);

    // 2. Sort them by time (Entry Time) to determine order
    sameDayTrades.sort((a, b) => {
        const timeA = a.entryTime || "00:00";
        const timeB = b.entryTime || "00:00";
        return timeA.localeCompare(timeB);
    });

    const index = sameDayTrades.findIndex(t => t._id === transaction._id);

    // Rule 1: Max 2 Trades per day
    if (index >= 2) {
        return { followed: false, reason: "Violation: Max 2 trades/day limit exceeded" };
    }

    // Rule 2: If 1st trade is a Loss, stop trading (No Revenge Trading)
    if (index > 0) {
        const firstTrade = sameDayTrades[0];
        if (firstTrade.type === "expense") {
            return { followed: false, reason: "Violation: First trade was a loss. Stop trading." };
        }
    }

    return { followed: true, reason: "Rules followed" };
};
