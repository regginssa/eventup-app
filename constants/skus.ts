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

    ticket_eur_5: "EVENTWORLD.TICKET.EUR.5",
    ticket_eur_10: "EVENTWORLD.TICKET.EUR.10",
    ticket_eur_20: "EVENTWORLD.TICKET.EUR.20",
    ticket_eur_50: "EVENTWORLD.TICKET.EUR.50",
    ticket_eur_100: "EVENTWORLD.TICKET.EUR.100",

    ticket_pln_20: "EVENTWORLD.TICKET.PLN.20",
    ticket_pln_40: "EVENTWORLD.TICKET.PLN.40",
    ticket_pln_80: "EVENTWORLD.TICKET.PLN.80",
    ticket_pln_200: "EVENTWORLD.TICKET.PLN.200",
    ticket_pln_400: "EVENTWORLD.TICKET.PLN.400",
  },
};

export function getSubscriptionSku(months: 1 | 3 | 6 | 12) {
  return IOS_SKUS.subscription[`month_${months}`];
}

export function getTicketSku(currency: string, price: number) {
  const key = `ticket_${currency.toLowerCase()}_${price}` as any;
  return IOS_SKUS.ticket[key as keyof typeof IOS_SKUS.ticket];
}
