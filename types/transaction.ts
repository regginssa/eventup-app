export type TTransactionStatus = "created" | "pending" | "completed" | "failed";

export interface ITransaction {
  _id?: string;
  type: "buy" | "sell";
  paymentMethod: "credit" | "crypto" | "token";
  payoutToken?: string;
  userId: string;
  txId: string;
  amount: number;
  amountReceived: number;
  currency: string;
  service: "ticket" | "subscription" | "booking";
  status: TTransactionStatus;
  metadata: any;
}
