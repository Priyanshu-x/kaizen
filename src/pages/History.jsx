import { useState, useEffect } from "react";
import { TransactionTable } from "../components/TransactionTable";
import { useTransaction } from "../context/TransactionContext";

export function History() {
  const { transactions } = useTransaction();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 font-heading">History</h2>
      <TransactionTable transactions={transactions} />
    </div>
  );
}