/**
 * Converts a category/subcategory/vibe/venue key into a readable label
 * Examples:
 *  - "music_and_concerts" => "Music & Concerts"
 *  - "gym/studio" => "Gym / Studio"
 *  - "high-energy_and_loud" => "High-Energy & Loud"
 *  - "r&b/soul" => "R&B / Soul"
 */
export const formatEventLabel = (key: string) => {
  if (!key || typeof key !== "string") return "";

  return key
    .replace(/_and_/gi, " & ") // handle "_and_" to " & "
    .replace(/_/g, " ")
    .replace(/\//g, " / ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bEdm\b/gi, "EDM")
    .replace(/\bDj\b/gi, "DJ")
    .replace(/\bR&b\b/gi, "R&B")
    .replace(/\bK-pop\b/gi, "K-Pop")
    .replace(/\bJ-pop\b/gi, "J-Pop")
    .replace(/\bE-sports\b/gi, "E-Sports")
    .replace(/\bF1\b/gi, "F1")
    .trim();
};

export const formatEventDateTime = (
  date: string | undefined,
  time: string | undefined,
) => {
  if (!date || !time) return "--:--";

  const [, month, day] = date.split("-");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day}, ${months[Number(month) - 1]} ${time
    .split(":")
    .slice(0, 2)
    .join(":")}`;
};

export const formatTimezoneShort = (timeZone: string) => {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short",
    }).formatToParts(new Date());

    return (
      parts.find((p) => p.type === "timeZoneName")?.value || timeZone || "N/A"
    );
  } catch {
    return timeZone || "N/A";
  }
};

export const formatBookingDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const getCurrencySymbol = (code: "USD" | "EUR" | "PLN"): string => {
  const map: Record<"USD" | "EUR" | "PLN", string> = {
    USD: "$",
    EUR: "€",
    PLN: "zł",
  };

  return map[code];
};

export const normalizeDate = (d: Date) => {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
  return nd.getTime();
};

export const normalizeDateUTC = (d: Date) => {
  const nd = new Date(d);
  nd.setUTCHours(0, 0, 0, 0);
  return nd.getTime();
};

/**
 * Format a personal name so that only the first letter of each part is uppercase.
 * Examples:
 *  - "smith doe jh" => "Smith Doe Jh"
 *  - "o'neill" => "O'neill"
 *  - "anna-maria" => "Anna-Maria"
 */
export const formatName = (value: string) => {
  if (!value || typeof value !== "string") return "";

  return value
    .trim()
    .split(/\s+/)
    .map((word) =>
      // keep hyphenated parts capitalized on each segment, e.g. anna-maria => Anna-Maria
      word
        .split("-")
        .map((part) => {
          if (!part) return "";
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join("-"),
    )
    .join(" ");
};

export const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart}`;
};

export const formatTravelproDateTime = (
  dateObj: Date,
): { date: string; time: string } => {
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const day = dateObj.getDate().toString().padStart(2, "0");

  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
};

export const toLocalISOString = (dateInput: Date | string): string => {
  const date = new Date(dateInput);

  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
