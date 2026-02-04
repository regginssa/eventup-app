import { BABYU_TOKEN_ADDRESS, CHRLE_TOKEN_ADDRESS } from "@/config/env";
import axios from "axios";

export const fetchTokenPrices = async (): Promise<{
  chrle: number; // USD
  babyu: number; // USD
}> => {
  try {
    //
    // 1) Fetch BABYU price from Raydium swap API
    //
    const babyuURL = `https://api-v3.raydium.io/mint/price?mints=${BABYU_TOKEN_ADDRESS}`;
    const babyuRes = await axios.get(babyuURL);
    const babyuPrice = Number(babyuRes.data?.data?.[BABYU_TOKEN_ADDRESS] ?? 0);

    //
    // 2) Fetch CHRLE marketcap + supply from Launchpad
    //
    const chrleURL = `https://launch-mint-v1.raydium.io/get/by/mints?ids=${CHRLE_TOKEN_ADDRESS}`;
    const chrleRes = await axios.get(chrleURL);

    const chrleRow = chrleRes.data?.data?.rows?.[0];

    let chrlePrice = 0;

    if (chrleRow && chrleRow.marketCap && chrleRow.supply) {
      const marketCap = Number(chrleRow.marketCap);
      const supply = Number(chrleRow.supply);
      chrlePrice = marketCap / supply; // USD price
    }

    return {
      chrle: chrlePrice,
      babyu: babyuPrice,
    };
  } catch (err) {
    console.error("Failed to fetch token prices:", err);
    return {
      chrle: 0,
      babyu: 0,
    };
  }
};
