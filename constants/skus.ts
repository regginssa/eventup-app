export const IOS_SKUS = {
  subscription: {
    month_1: "ETW.SUBSCRIPTION.1",
    month_3: "ETW.SUBSCRIPTION.3",
    month_6: "ETW.SUBSCRIPTION.6",
    month_12: "ETW.SUBSCRIPTION.12",
  },
  ticket: {
    ticket_usd_5: "ETW.TICKET.USD.5",
    ticket_usd_10: "ETW.TICKET.USD.10",
    ticket_usd_20: "ETW.TICKET.USD.20",
    ticket_usd_50: "ETW.TICKET.USD.50",
    ticket_usd_100: "ETW.TICKET.USD.100",

    ticket_eur_5: "ETW.TICKET.USD.5",
    ticket_eur_10: "ETW.TICKET.USD.10",
    ticket_eur_20: "ETW.TICKET.USD.20",
    ticket_eur_50: "ETW.TICKET.USD.50",
    ticket_eur_100: "ETW.TICKET.USD.100",

    ticket_pln_5: "ETW.TICKET.USD.5",
    ticket_pln_10: "ETW.TICKET.USD.10",
    ticket_pln_20: "ETW.TICKET.USD.20",
    ticket_pln_50: "ETW.TICKET.USD.50",
    ticket_pln_100: "ETW.TICKET.USD.100",
  },
};

export function getSubscriptionSku(months: 1 | 3 | 6 | 12) {
  return IOS_SKUS.subscription[`month_${months}`];
}

type Currency = "usd" | "eur" | "pln";
type TicketPrice = 5 | 10 | 20 | 50 | 100;
type TicketKey = `ticket_${Currency}_${TicketPrice}`;

export function getTicketSku(currency: Currency, price: TicketPrice) {
  const key = `ticket_${currency}_${price}` as TicketKey;
  return IOS_SKUS.ticket[key];
}
