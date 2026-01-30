import { IEvent, IUser } from "@/types/data";

type Ranked = {
  event: IEvent;
  matchTier: number; // 1(best)..8(worst)
  locationScore: number; // 0..3 (nearby) or 0..2 (country) + city/region bonus
  totalScore: number; // (9 - tier) + locationScore
  distance?: number; // meters (only if both coords present)
  reasons: string[]; // human-readable why this got its tier/score
};

const RAD10 = 10_000;
const RAD25 = 25_000;
const RAD50 = 50_000;

/* ---------- helpers ---------- */

const toArr = (v?: string[] | null): string[] => (Array.isArray(v) ? v : []);
const lc = (s?: string | null) => (s ? s.toLowerCase() : "");
const hasOverlap = (a: string[], b: string[]) =>
  a.length > 0 && b.length > 0 && a.some((x) => b.includes(x));
const setEquals = (a: string[], b: string[]) =>
  a.length === b.length && a.every((x) => b.includes(x));
const isSubset = (needles: string[], hay: string[]) =>
  needles.length > 0 && needles.every((x) => hay.includes(x));

/** Haversine (meters) */
function distanceMeters(
  a?: { latitude: number; longitude: number } | null,
  b?: { latitude: number; longitude: number } | null
): number | undefined {
  if (!a || !b) return undefined;
  const R = 6371000;
  const φ1 = (a.latitude * Math.PI) / 180;
  const φ2 = (b.latitude * Math.PI) / 180;
  const dφ = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dλ = ((b.longitude - a.longitude) * Math.PI) / 180;
  const sinDφ = Math.sin(dφ / 2);
  const sinDλ = Math.sin(dλ / 2);
  const h = sinDφ * sinDφ + Math.cos(φ1) * Math.cos(φ2) * (sinDλ * sinDλ);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ---------- core ranking ---------- */

/**
 * Compute match tier (1..8, 1 best) and reasons.
 *
 * Tiers:
 * 1) category exact + subcategories exact-ish (equal or event ⊇ preferred) + vibe equal + venue_type equal
 * 2) category exact + subs exact-ish + (vibe overlap OR venue overlap)
 * 3) category exact + subs overlap + (vibe equal OR venue equal)
 * 4) category exact + subs overlap
 * 5) category exact
 * 6) no category, but overlap in (subs OR vibe OR venue)
 * 7) no above, but location affinity (>0)
 * 8) time-only fallback
 */
function computeTier(
  ev: IEvent,
  user: IUser,
  locationScore: number
): { tier: number; reasons: string[] } {
  const prefs = user.preferred ?? ({} as IUser["preferred"]);
  const prefCategory = prefs.category ?? null;
  const prefSubs = toArr(prefs.subcategories).map(lc);
  const prefVibe = toArr(prefs.vibe).map(lc);
  const prefVenue = toArr(prefs.venue_type).map(lc);

  const evCategory = ev.category ?? null;
  const evSubs = toArr(ev.subcategories).map(lc);
  const evVibe = toArr(ev.vibe).map(lc);
  const evVenue = toArr(ev.venue_type).map(lc);

  const reasons: string[] = [];

  const match_category = !!prefCategory && evCategory === prefCategory;
  if (match_category) reasons.push("category:exact");

  const subs_overlap = hasOverlap(evSubs, prefSubs);
  const subs_equal = prefSubs.length > 0 && setEquals(evSubs, prefSubs);
  const subs_superset = prefSubs.length > 0 && isSubset(prefSubs, evSubs);
  const subs_exactish = prefSubs.length > 0 && (subs_equal || subs_superset);
  if (subs_exactish) reasons.push("subs:exactish");
  else if (subs_overlap) reasons.push("subs:overlap");

  const vibe_overlap = hasOverlap(evVibe, prefVibe);
  const vibe_equal = prefVibe.length > 0 && setEquals(evVibe, prefVibe);
  const venue_overlap = hasOverlap(evVenue, prefVenue);
  const venue_equal = prefVenue.length > 0 && setEquals(evVenue, prefVenue);

  if (vibe_equal) reasons.push("vibe:equal");
  else if (vibe_overlap) reasons.push("vibe:overlap");

  if (venue_equal) reasons.push("venue:equal");
  else if (venue_overlap) reasons.push("venue:overlap");

  // Ordered tier rules
  if (match_category && subs_exactish && vibe_equal && venue_equal)
    return { tier: 1, reasons };
  if (match_category && subs_exactish && (vibe_overlap || venue_overlap))
    return { tier: 2, reasons };
  if (match_category && subs_overlap && (vibe_equal || venue_equal))
    return { tier: 3, reasons };
  if (match_category && subs_overlap) return { tier: 4, reasons };
  if (match_category) return { tier: 5, reasons };
  if (subs_overlap || vibe_overlap || venue_overlap)
    return { tier: 6, reasons };
  if (locationScore > 0) return { tier: 7, reasons };
  return { tier: 8, reasons };
}

/** Location score: nearby buckets OR same-country; city-mode: region equals user.region gives a bonus. */
function computeLocationScore(
  ev: IEvent,
  user: IUser
): { score: number; distance?: number; reasons: string[] } {
  const reasons: string[] = [];
  const mode = user.preferred?.location ?? "nearby";

  const userCoord = user.location?.coordinate;
  const evCoord = ev.coordinate;
  const d = distanceMeters(userCoord, evCoord);

  let base = 0;
  if (mode === "nearby" && d != null) {
    if (d <= RAD10) {
      base = 3;
      reasons.push("nearby:≤10km");
    } else if (d <= RAD25) {
      base = 2;
      reasons.push("nearby:≤25km");
    } else if (d <= RAD50) {
      base = 1;
      reasons.push("nearby:≤50km");
    }
  } else if (mode === "country") {
    const sameCountry =
      !!user.location?.country_code &&
      !!ev.country_code &&
      lc(user.location.country_code) === lc(ev.country_code);
    if (sameCountry) {
      base = 2;
      reasons.push("country:same");
    }
  }

  // "city" mode: user picks city/region string; events only have region
  if (mode === "city") {
    const userRegion = lc(user.location?.region);
    const evRegion = lc(ev.region);
    if (userRegion && evRegion && userRegion === evRegion) {
      base += 3;
      reasons.push("city:region-match");
    }
  }

  return { score: base, distance: d, reasons };
}

/**
 * Rank and order events from best to worst match.
 *
 * totalScore = (9 - tier) + locationScore
 * Sort: totalScore desc, distance asc (if present), opening_date asc, lastSyncedAt desc, title asc
 */
export function rankEvents(events: IEvent[], user: IUser): IEvent[] {
  const ranked: Ranked[] = events.map((ev) => {
    const {
      score: locationScore,
      distance,
      reasons: locWhy,
    } = computeLocationScore(ev, user);
    const { tier, reasons: tierWhy } = computeTier(ev, user, locationScore);
    const tierBase = 9 - tier; // 8..1
    const totalScore = tierBase + locationScore;

    return {
      event: ev,
      matchTier: tier,
      locationScore,
      totalScore,
      distance,
      reasons: [...tierWhy, ...locWhy],
    };
  });

  ranked.sort((a, b) => {
    // higher score first
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;

    // then closer first (if both have distances)
    if (a.distance != null && b.distance != null && a.distance !== b.distance) {
      return a.distance - b.distance;
    }

    // then earliest opening_date
    const ad = a.event.opening_date
      ? new Date(a.event.opening_date).getTime()
      : Number.MAX_SAFE_INTEGER;
    const bd = b.event.opening_date
      ? new Date(b.event.opening_date).getTime()
      : Number.MAX_SAFE_INTEGER;
    if (ad !== bd) return ad - bd;

    // then freshest sync
    const als = a.event.lastSyncedAt
      ? new Date(a.event.lastSyncedAt).getTime()
      : 0;
    const bls = b.event.lastSyncedAt
      ? new Date(b.event.lastSyncedAt).getTime()
      : 0;
    if (bls !== als) return bls - als;

    // finally stable by title/id
    const at = (a.event.title ?? "").localeCompare(b.event.title ?? "");
    if (at !== 0) return at;
    return (a.event.id ?? "").localeCompare(b.event.id ?? "");
  });

  return ranked.map((r) => r.event);
}

/* ---------- optional: debug helper ---------- */

/** Returns ranked entries WITH scores/tiers (useful for dev tools or experiments). */
export function rankEventsWithMeta(events: IEvent[], user: IUser): Ranked[] {
  const out = events.map((ev) => {
    const {
      score: locationScore,
      distance,
      reasons: locWhy,
    } = computeLocationScore(ev, user);
    const { tier, reasons: tierWhy } = computeTier(ev, user, locationScore);
    return {
      event: ev,
      matchTier: tier,
      locationScore,
      totalScore: 9 - tier + locationScore,
      distance,
      reasons: [...tierWhy, ...locWhy],
    };
  });

  out.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (a.distance != null && b.distance != null && a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    const ad = a.event.opening_date
      ? new Date(a.event.opening_date).getTime()
      : Number.MAX_SAFE_INTEGER;
    const bd = b.event.opening_date
      ? new Date(b.event.opening_date).getTime()
      : Number.MAX_SAFE_INTEGER;
    if (ad !== bd) return ad - bd;
    const als = a.event.lastSyncedAt
      ? new Date(a.event.lastSyncedAt).getTime()
      : 0;
    const bls = b.event.lastSyncedAt
      ? new Date(b.event.lastSyncedAt).getTime()
      : 0;
    if (bls !== als) return bls - als;
    const at = (a.event.title ?? "").localeCompare(b.event.title ?? "");
    if (at !== 0) return at;
    return (a.event.id ?? "").localeCompare(b.event.id ?? "");
  });

  return out;
}
