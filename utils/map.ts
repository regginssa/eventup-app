import { TFlightItemData } from "@/components/common/FlightItem";
import { THotelItemData } from "@/components/common/HotelItem";
import { TAmadeusFlightOffer, TAmadeusHotelOffer } from "@/types/amadeus";

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

/**
 * Maps Amadeus Hotel Offer API response to THotelItemData format
 * Takes the first offer from the offers array
 */
export const mapAmadeusHotelOfferToHotelItemData = (
  offer: TAmadeusHotelOffer,
  offerIndex: number = 0
): THotelItemData => {
  const hotelOffer = offer.offers?.[offerIndex];

  // Hotel basic info
  const hotelId = offer.hotel?.hotelId || "";
  const hotelName = offer.hotel?.name || "";
  const cityCode = offer.hotel?.cityCode || "";
  const latitude = offer.hotel?.latitude || 0;
  const longitude = offer.hotel?.longitude || 0;

  // Booking dates
  const checkInDate = hotelOffer?.checkInDate || "";
  const checkOutDate = hotelOffer?.checkOutDate || "";

  // Room info
  const roomType = hotelOffer?.room?.type || "";
  const roomCategory = hotelOffer?.room?.typeEstimated?.category || "";
  const roomDescription = hotelOffer?.room?.description?.text || "";
  const beds = hotelOffer?.room?.typeEstimated?.beds || 0;
  const bedType = hotelOffer?.room?.typeEstimated?.bedType || "";

  // Guests
  const adults = hotelOffer?.guests?.adults || 0;

  // Price
  const price = {
    total: hotelOffer?.price?.total || "0",
    currency: hotelOffer?.price?.currency?.toLowerCase() || "usd",
    base: hotelOffer?.price?.base,
  };

  // Cancellation/Refund policy
  const cancellationPolicy =
    hotelOffer?.policies?.cancellation?.description?.text || "";
  const cancellationType = hotelOffer?.policies?.cancellation?.type || "";
  const paymentType = hotelOffer?.policies?.paymentType || "";

  return {
    hotelId,
    hotelName,
    cityCode,
    latitude,
    longitude,
    checkInDate,
    checkOutDate,
    roomType,
    roomCategory,
    roomDescription,
    beds,
    bedType,
    adults,
    price,
    cancellationPolicy,
    cancellationType,
    paymentType,
  };
};
