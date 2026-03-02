const toISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const toShortDate = (date: Date | string | null): string => {
  if (!date) return "-";
  const toDate = new Date(date);
  const datePart = toDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timePart = toDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart}`;
};

const toShortDateTime = (date: Date | string | null): string => {
  if (!date) return "-";
  const toDate = new Date(date);
  const datePart = toDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timePart = toDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${timePart} ${datePart}`;
};

export default { toISOString, toShortDate, toShortDateTime };
