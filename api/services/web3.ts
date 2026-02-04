import { ApiResponse } from "@/types/api";
import AxiosInstance from "../client";
import { FETCH_TOKEN_PRICES_AND_FEE } from "../endpoints";

export const fetchTokenPricesAndFee = async (): Promise<
  ApiResponse<{ chrle: 0; babyu: 0; fee: 0 }>
> => {
  return await AxiosInstance.get(FETCH_TOKEN_PRICES_AND_FEE);
};
