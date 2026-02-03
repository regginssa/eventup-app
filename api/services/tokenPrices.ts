import { BABYU_TOKEN_ADDRESS, CHRLE_TOKEN_ADDRESS } from "@/config/env";
import axios from "axios";

export const fetchTokenPrices = async (): Promise<{
  chrle: number;
  babyu: number;
}> => {
  try {
    const url = `https://api-v3.raydium.io/mint/price?mints=${CHRLE_TOKEN_ADDRESS},${BABYU_TOKEN_ADDRESS}`;

    const { data } = await axios.get(url);

    return {
      chrle: Number(data.data[CHRLE_TOKEN_ADDRESS] ?? 0),
      babyu: Number(data.data[BABYU_TOKEN_ADDRESS] ?? 0),
    };
  } catch (err) {
    console.error("Failed to fetch token prices:", err);
    return {
      chrle: 0,
      babyu: 0,
    };
  }
};
