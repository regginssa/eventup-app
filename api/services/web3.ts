import { ApiResponse } from "@/types/api";
import AxiosInstance from "../client";
import { FETCH_TOKEN_PRICES } from "../endpoints";

export const fetchTokenPrices = async (): Promise<
  ApiResponse<{ chrle: 0; babyu: 0 }>
> => {
  return await AxiosInstance.get(FETCH_TOKEN_PRICES);
};
