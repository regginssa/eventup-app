export const IOS_SKUS = {
  subscription: {
    month_1: "ETP.SUBSCRIPTION.1",
    month_3: "ETP.SUBSCRIPTION.3",
    month_6: "ETP.SUBSCRIPTION.6",
    month_12: "ETP.SUBSCRIPTION.12",
  },
  ticket: {
    ticket_usd_5: "ETP.TICKET.USD.5",
    ticket_usd_10: "ETP.TICKET.USD.10",
    ticket_usd_20: "ETP.TICKET.USD.20",
    ticket_usd_50: "ETP.TICKET.USD.50",
    ticket_usd_100: "ETP.TICKET.USD.100",

    ticket_eur_5: "ETP.TICKET.USD.5",
    ticket_eur_10: "ETP.TICKET.USD.10",
    ticket_eur_20: "ETP.TICKET.USD.20",
    ticket_eur_50: "ETP.TICKET.USD.50",
    ticket_eur_100: "ETP.TICKET.USD.100",

    ticket_pln_5: "ETP.TICKET.USD.5",
    ticket_pln_10: "ETP.TICKET.USD.10",
    ticket_pln_20: "ETP.TICKET.USD.20",
    ticket_pln_50: "ETP.TICKET.USD.50",
    ticket_pln_100: "ETP.TICKET.USD.100",
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
