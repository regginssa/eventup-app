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

export const formatEventDate = (date: Date) => {
  if (!date) return "";

  const d = new Date(date);
  const options = { month: "short", day: "numeric" };
  const datePart = d.toLocaleDateString("en-US", options as any);

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minStr = minutes.toString().padStart(2, "0");

  return `${datePart}, ${hours}.${minStr} ${ampm}`;
};

export const getCurrencySymbol = (code: "usd" | "eur" | "pln"): string => {
  const map: Record<"usd" | "eur" | "pln", string> = {
    usd: "$",
    eur: "€",
    pln: "zł",
  };

  return map[code];
};

export const normalizeDate = (d: Date) => {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
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
        .join("-")
    )
    .join(" ");
};
