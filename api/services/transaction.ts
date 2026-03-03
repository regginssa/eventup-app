import { ApiResponse } from "@/types/api";
import { ITransaction } from "@/types/transaction";
import AxiosInstance from "../client";
import { TRANSACTION_BASE } from "../endpoints";

const create = async (
  bodyData: ITransaction,
): Promise<ApiResponse<ITransaction>> => {
  return await AxiosInstance.post(TRANSACTION_BASE, bodyData);
};

export default { create };
