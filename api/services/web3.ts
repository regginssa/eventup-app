import { ApiResponse } from "@/types/api";
import { ITransaction } from "@/types/transaction";
import AxiosInstance from "../client";
import {
  CREATE_TICKET_SELL_PAYOUT,
  FETCH_TOKEN_PRICES_AND_FEE,
  WEB3_BASE,
} from "../endpoints";

const getPrices = async (): Promise<
  ApiResponse<{
    eth: number;
    sol: number;
    chrle: number;
    babyu: number;
  }>
> => {
  return await AxiosInstance.get(WEB3_BASE + "/prices");
};

const getCheckoutUrl = async (data: any): Promise<ApiResponse<string>> => {
  return await AxiosInstance.post(WEB3_BASE + "/checkout-url", data);
};

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

export default { getPrices, getCheckoutUrl };
