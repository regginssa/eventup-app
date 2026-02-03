import { BABYU_TOKEN_ADDRESS, CHRLE_TOKEN_ADDRESS } from "@/config/env";
import axios from "axios";

export const fetchTokenPrices = async (): Promise<{
  chrle: number;
  babyu: number;
}> => {
  try {
    const url = `https://api.raydium.io/v2/sdk/price?mints=${CHRLE_TOKEN_ADDRESS},${BABYU_TOKEN_ADDRESS}`;

    const { data } = await axios.get(url);

    return {
      chrle: data[CHRLE_TOKEN_ADDRESS]?.usd ?? 0,
      babyu: data[BABYU_TOKEN_ADDRESS]?.usd ?? 0,
    };
  } catch (err) {
    console.error("Failed to fetch token prices:", err);
    return {
      chrle: 0,
      babyu: 0,
    };
  }
};
