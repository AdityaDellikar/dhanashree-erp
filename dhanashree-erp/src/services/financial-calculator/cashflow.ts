import type { TransactionInput } from "@/features/transactions/transaction.schema";

export type CashflowSummary = {
  income: number;
  expense: number;
  netCashflow: number;
};

export function calculateCashflow(
  transactions: readonly Pick<TransactionInput, "amount" | "type">[],
): CashflowSummary {
  return transactions.reduce<CashflowSummary>(
    (summary, transaction) => {
      if (transaction.type === "income") {
        return {
          ...summary,
          income: summary.income + transaction.amount,
          netCashflow: summary.netCashflow + transaction.amount,
        };
      }

      return {
        ...summary,
        expense: summary.expense + transaction.amount,
        netCashflow: summary.netCashflow - transaction.amount,
      };
    },
    { expense: 0, income: 0, netCashflow: 0 },
  );
}
