import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { getRuleStatus } from "../utils/tradingRules";

export function RuleBadge({ transaction, allTransactions }) {
    const status = getRuleStatus(transaction, allTransactions);

    return status.followed ? (
        <CheckCircle className="h-4 w-4 text-green-500" title={status.reason} />
    ) : (
        <AlertTriangle className="h-4 w-4 text-yellow-500" title={status.reason} />
    );
}
