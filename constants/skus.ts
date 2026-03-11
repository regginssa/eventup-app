export const IOS_SKUS = {
  month_1: "EVENTUP001.INDIVIDUAL.SUBSCRIPTION.1",
  month_3: "EVENTUP001.INDIVIDUAL.SUBSCRIPTION.3",
  month_6: "EVENTUP001.INDIVIDUAL.SUBSCRIPTION.6",
  month_12: "EVENTUP001.INDIVIDUAL.SUBSCRIPTION.12",
};

export function getSku(months: 1 | 3 | 6 | 12) {
  return IOS_SKUS[`month_${months}`];
}
