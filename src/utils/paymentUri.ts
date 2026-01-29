import { TCrypto } from "@/src/components/common/CryptoPaymentQR";

const CHAIN_IDS = { ETH: 1, BNB: 56 } as const;

const toWei = (amt: number) => BigInt(Math.round(amt * 1e6)) * 10_000_000_000n;
const toNanoTon = (amt: number) => Math.round(amt * 1e9);

export const buildPaymentURI = (
  net: TCrypto,
  address: string,
  amount: number
): string => {
  switch (net) {
    case "eth": {
      const wei = toWei(amount).toString();
      return `ethereum:${address}@${CHAIN_IDS.ETH}?value=${wei}`;
    }
    case "usdt": {
      const wei = toWei(amount).toString();
      return `ethereum:${address}@${CHAIN_IDS.ETH}?value=${wei}`;
    }
    case "usdc": {
      const wei = toWei(amount).toString();
      return `ethereum:${address}@${CHAIN_IDS.ETH}?value=${wei}`;
    }
    case "bnb": {
      const wei = toWei(amount).toString();
      return `ethereum:${address}@${CHAIN_IDS.BNB}?value=${wei}`;
    }
    case "sol":
      return `solana:${address}?amount=${amount}`;
    case "ton": {
      const nanotons = toNanoTon(amount);
      return `ton://transfer/${address}?amount=${nanotons}`;
    }
  }
};
