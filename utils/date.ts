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

const to24HourTime = (date: Date | string): string => {
  if (!date) return "N/A";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "Invalid Date";

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const to24Hour = (date: Date | string): string => {
  if (!date) return "N/A";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "Invalid Date";

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const toTransferDate = (date: Date | string): string => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export default {
  toISOString,
  toShortDate,
  toShortDateTime,
  to24HourTime,
  to24Hour,
  toTransferDate,
};
