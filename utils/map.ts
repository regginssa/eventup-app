import { TFlightItemData } from "@/components/common/FlightItem";
import { TAmadeusFlightOffer } from "@/types/amadeus";

/**
 * Maps Amadeus Flight Offer API response to TFlightItemData format
 */
export const mapAmadeusFlightOfferToFlightItemData = (
  offer: TAmadeusFlightOffer
): TFlightItemData => {
  const itinerary = offer.itineraries?.[0];
  const segments = itinerary?.segments || [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  // Get departure and arrival info
  const from = firstSegment?.departure?.iataCode || "";
  const to = lastSegment?.arrival?.iataCode || "";
  const departureDate = firstSegment?.departure?.at || "";
  const arrivalDate = lastSegment?.arrival?.at || "";

  // Calculate stops (number of segments minus 1, but if only 1 segment then 0 stops)
  const stops = segments.length > 1 ? segments.length - 1 : 0;

  // Get airline info
  const airlineCode =
    firstSegment?.carrierCode || offer.validatingAirlineCodes?.[0] || "";
  const airlineName = airlineCode; // Amadeus API doesn't always provide airline name, use code as fallback

  // Get flight number (combine carrier code and number if needed)
  const flightNumber = firstSegment?.number
    ? `${firstSegment.carrierCode}${firstSegment.number}`
    : "";

  // Get seats left
  const seatsLeft = offer.numberOfBookableSeats || 0;

  // Check refundability from amenities (check all segments)
  const refundable =
    offer.travelerPricings?.[0]?.fareDetailsBySegment?.some((segment) =>
      segment.amenities?.some((amenity) =>
        amenity.description?.toUpperCase().includes("REFUNDABLE")
      )
    ) || false;

  // Get price
  const price = {
    total: offer.price?.total || offer.price?.grandTotal || "0",
    currency: offer.price?.currency?.toLowerCase() || "usd",
  };

  return {
    from,
    to,
    departureDate,
    arrivalDate,
    stops,
    airlineCode,
    airlineName,
    flightNumber,
    seatsLeft,
    refundable,
    price,
  };
};
