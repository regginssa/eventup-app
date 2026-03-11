export const IOS_SKUS = {
  subscription: {
    month_1: "EVENTWORLD.SUBSCRIPTION.1",
    month_3: "EVENTWORLD.SUBSCRIPTION.3",
    month_6: "EVENTWORLD.SUBSCRIPTION.6",
    month_12: "EVENTWORLD.SUBSCRIPTION.12",
  },
  ticket: {
    ticket_usd_5: "EVENTWORLD.TICKET.USD.5",
    ticket_usd_10: "EVENTWORLD.TICKET.USD.10",
    ticket_usd_20: "EVENTWORLD.TICKET.USD.20",
    ticket_usd_50: "EVENTWORLD.TICKET.USD.50",
    ticket_usd_100: "EVENTWORLD.TICKET.USD.100",

    ticket_eur_5: "EVENTWORLD.TICKET.USD.5",
    ticket_eur_10: "EVENTWORLD.TICKET.USD.10",
    ticket_eur_20: "EVENTWORLD.TICKET.USD.20",
    ticket_eur_50: "EVENTWORLD.TICKET.USD.50",
    ticket_eur_100: "EVENTWORLD.TICKET.USD.100",

    ticket_pln_5: "EVENTWORLD.TICKET.USD.5",
    ticket_pln_10: "EVENTWORLD.TICKET.USD.10",
    ticket_pln_20: "EVENTWORLD.TICKET.USD.20",
    ticket_pln_50: "EVENTWORLD.TICKET.USD.50",
    ticket_pln_100: "EVENTWORLD.TICKET.USD.100",
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
