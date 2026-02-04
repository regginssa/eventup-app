import { ApiResponse } from "@/types/api";
import { ITransaction } from "@/types/transaction";
import AxiosInstance from "../client";
import {
  CREATE_TICKET_SELL_PAYOUT,
  FETCH_TOKEN_PRICES_AND_FEE,
} from "../endpoints";

export const fetchTokenPricesAndFee = async (): Promise<
  ApiResponse<{ chrle: 0; babyu: 0; fee: 0 }>
> => {
  return await AxiosInstance.get(FETCH_TOKEN_PRICES_AND_FEE);
};

export const createSellTicketPayout = async (
  bodyData: any,
): Promise<ApiResponse<ITransaction>> => {
  return await AxiosInstance.post(CREATE_TICKET_SELL_PAYOUT, bodyData);
};
