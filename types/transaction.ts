export interface ITransaction {
  _id?: string;
  type: "credit" | "crypto" | "token";
  userId: string;
  txId: string;
  amount: number;
  amountReceived: number;
  currency: string;
  service: "ticket" | "subscription" | "booking";
  status: "created" | "pending" | "completed" | "failed";
  metadata: string;
}
