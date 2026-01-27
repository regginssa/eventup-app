import { TFlightItemData } from "@/components/common/FlightItem";
import { THotelItemData } from "@/components/common/HotelItem";
import { TTransferItemData } from "@/components/common/TransferItem";
import {
  TAmadeusFlightOffer,
  TAmadeusFlightOrder,
  TAmadeusHotelOffer,
  TAmadeusHotelOrder,
  TAmadeusTransferOffer,
  TAmadeusTransferOrder,
} from "@/types/amadeus";
import {
  TBookingFlight,
  TBookingHotel,
  TBookingTransfer,
} from "@/types/booking";

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
 *
 * Explanation:
 * - A TAmadeusHotelOffer represents a hotel with multiple booking options
 * - The `offers` array contains different room/rate options (different prices,
 *   cancellation policies, room types) for the same hotel
 * - Each item in `offers` is a different booking option
 *
 * This function extracts:
 * - Hotel information (shared across all offers): name, location, address
 * - Offer-specific information: dates, room type, price, cancellation policy
 *
 * @param offer - The hotel offer object containing hotel info and offers array
 * @param offerIndex - Index of the specific offer to extract (default: 0 for first offer)
 * @returns Mapped hotel item data ready for display
 * @throws Error if offers array is empty or offerIndex is out of bounds
 */
export const mapAmadeusHotelOfferToHotelItemData = (
  offer: TAmadeusHotelOffer,
  offerIndex: number = 0
): THotelItemData => {
  // Validate that offers array exists and has items
  if (!offer.offers || offer.offers.length === 0) {
    throw new Error(
      `Hotel offer has no available offers. Hotel: ${
        offer.hotel?.name || "Unknown"
      }`
    );
  }

  // Validate offerIndex is within bounds
  if (offerIndex < 0 || offerIndex >= offer.offers.length) {
    throw new Error(
      `Invalid offerIndex ${offerIndex}. Hotel has ${offer.offers.length} offer(s).`
    );
  }

  const hotelOffer = offer.offers[offerIndex];

  // Offer ID (needed for booking and pricing)
  const offerId = hotelOffer?.id || "";

  // Hotel basic info (shared across all offers)
  const hotelId = offer.hotel?.hotelId || "";
  const hotelName = offer.hotel?.name || "";
  const cityCode = offer.hotel?.cityCode || "";
  const latitude = offer.hotel?.latitude || 0;
  const longitude = offer.hotel?.longitude || 0;

  // Booking dates (specific to this offer)
  const checkInDate = hotelOffer?.checkInDate || "";
  const checkOutDate = hotelOffer?.checkOutDate || "";

  // Room info (specific to this offer)
  const roomType = hotelOffer?.room?.type || "";
  const roomCategory = hotelOffer?.room?.typeEstimated?.category || "";
  const roomDescription = hotelOffer?.room?.description?.text || "";
  const beds = hotelOffer?.room?.typeEstimated?.beds || 0;
  const bedType = hotelOffer?.room?.typeEstimated?.bedType || "";

  // Guests (specific to this offer)
  const adults = hotelOffer?.guests?.adults || 0;

  // Price (specific to this offer)
  const price = {
    total: hotelOffer?.price?.total || "0",
    currency: hotelOffer?.price?.currency?.toLowerCase() || "usd",
    base: hotelOffer?.price?.base,
  };

  // Cancellation/Refund policy (specific to this offer)
  const cancellationPolicy =
    hotelOffer?.policies?.cancellation?.description?.text || "";
  const cancellationType = hotelOffer?.policies?.cancellation?.type || "";
  const paymentType = hotelOffer?.policies?.paymentType || "";

  return {
    offerId,
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
    address: {
      countryCode: offer?.hotel?.address?.countryCode || "",
      postalCode: offer?.hotel?.address?.postalCode || "",
      stateCode: offer?.hotel?.address?.stateCode || "",
      cityName: offer?.hotel?.address?.cityName || "",
      lines: offer?.hotel?.address?.lines || [],
    },
  };
};

/**
 * Maps Amadeus Transfer Offer API response to TTransferItemData format
 */
export const mapAmadeusTransferOfferToTransferItemData = (
  offer: TAmadeusTransferOffer
): TTransferItemData => {
  // Extract from location
  const from =
    offer.start?.locationCode ||
    offer.startConnectedSegment?.departure?.iataCode ||
    "";

  // Extract to location
  const to =
    offer.end?.name ||
    offer.end?.address?.line ||
    offer.end?.locationCode ||
    offer.startConnectedSegment?.arrival?.iataCode ||
    "";

  // Travel date
  const travelDate = offer.start?.dateTime || "";

  // Count passengers from passengerCharacteristics
  let adults = 0;
  let children = 0;
  let infants = 0;

  offer.passengerCharacteristics?.forEach((pax) => {
    if (pax.passengerTypeCode === "ADT") {
      adults++;
    } else if (pax.passengerTypeCode === "CHD") {
      children++;
    } else if (pax.passengerTypeCode === "INF") {
      infants++;
    }
  });

  // Vehicle info
  const vehicleType = offer.vehicle?.category || "";
  const vehicleDescription = offer.vehicle?.description || "";
  const vehicleImage = offer.vehicle?.imageURL;
  const seats = offer.vehicle?.seats?.[0]?.count || 0;

  // Format luggage info
  const luggageParts: string[] = [];
  offer.vehicle?.baggages?.forEach((bag) => {
    luggageParts.push(`${bag.count}x ${bag.size || "N/A"}`);
  });
  const luggage = luggageParts.join(", ") || "";

  // Service provider
  const transferCompany = offer.serviceProvider?.name || "";
  const companyLogo = offer.serviceProvider?.logoUrl;

  // Estimate transfer time from distance (rough estimate: 1km = 1 minute in city, 1km = 0.5 minute on highway)
  let transferTime: string | undefined;
  if (offer.distance) {
    const estimatedMinutes = Math.ceil(offer.distance.value * 0.8); // Rough estimate
    transferTime = estimatedMinutes.toString();
  }

  // Price
  const price = {
    total: offer.quotation?.monetaryAmount || "0",
    currency: offer.quotation?.currencyCode?.toLowerCase() || "usd",
    base: offer.quotation?.base?.monetaryAmount,
  };

  // Distance
  const distance = offer.distance
    ? {
        value: offer.distance.value,
        unit: offer.distance.unit,
      }
    : undefined;

  // Cancellation policy (from cancellation rules)
  const cancellationPolicy = offer.cancellationRules
    ?.map((rule) => {
      if (rule.feeType === "PERCENTAGE") {
        return `${rule.feeValue}% fee if cancelled ${rule.metricMin}-${
          rule.metricMax
        } ${rule.metricType.toLowerCase()} before`;
      } else if (rule.feeType === "FIXED") {
        return `$${rule.feeValue} fee if cancelled ${rule.metricMin}-${
          rule.metricMax
        } ${rule.metricType.toLowerCase()} before`;
      }
      return "";
    })
    .filter(Boolean)
    .join("; ");

  return {
    id: offer.id,
    transferType: offer.transferType,
    from,
    to,
    travelDate,
    adults,
    children,
    infants,
    vehicleType,
    vehicleDescription,
    vehicleImage,
    seats,
    luggage,
    transferCompany,
    companyLogo,
    transferTime,
    price,
    distance,
    cancellationPolicy,
  };
};

export const mapAmadeusFlightOrderToBookingFlightData = (
  order: TAmadeusFlightOrder
): TBookingFlight => {
  const airline =
    order.flightOffers[0].itineraries[0].segments[0].carrierCode || "";
  const departure = {
    airport:
      order.flightOffers[0].itineraries[0].segments[0].departure.iataCode || "",
    datetime:
      order.flightOffers[0].itineraries[0].segments[0].departure.at || "",
  };
  const arrival = {
    airport:
      order.flightOffers[0].itineraries[0].segments[
        order.flightOffers[0].itineraries[0].segments.length - 1
      ].arrival.iataCode || "",
    datetime:
      order.flightOffers[0].itineraries[0].segments[
        order.flightOffers[0].itineraries[0].segments.length - 1
      ].arrival.at || "",
  };
  const className =
    order.flightOffers[0].itineraries[0].segments[0].co2Emissions?.[0]?.cabin ||
    "";
  const confirmationCode = order.associatedRecords?.[0]?.reference || "";
  const orderId = order.id;

  return {
    orderId,
    airline,
    departure,
    arrival,
    class: className,
    confirmationCode,
  };
};

export const mapAmadeusHotelOrderToBookingHotelData = (
  order: TAmadeusHotelOrder
): TBookingHotel => {
  const orderId = order.id;
  const hotel = {
    id: order.hotelBookings[0].hotel.hotelId,
    name: order.hotelBookings[0].hotel.name,
  };
  const checkIn = order.hotelBookings[0].hotelOffer.checkInDate;
  const checkOut = order.hotelBookings[0].hotelOffer.checkOutDate;
  const rooms = Array.from(
    { length: order.hotelBookings[0].hotelOffer.roomQuantity },
    (_, index) => ({
      description: order.hotelBookings[0].hotelOffer.room.description.text,
      type: order.hotelBookings[0].hotelOffer.room.type,
    })
  );
  const confirmationCode = order.associatedRecords?.[0]?.reference || "";
  const providerCode =
    order.hotelBookings[0].hotelProviderInformation?.[0]?.hotelProviderCode ||
    "";

  return {
    orderId,
    hotel,
    checkIn,
    checkOut,
    rooms,
    confirmationCode,
    providerCode,
  };
};

export const mapAmadeusTransferOrderToBookingTransferData = (
  order: TAmadeusTransferOrder
): TBookingTransfer => {
  const orderId = order.id;
  const type = order.transfers[0].transferType;
  const start = {
    locationCode: order.transfers[0].start.locationCode,
    datetime: order.transfers[0].start.dateTime,
  };
  const end = {
    googlePlaceId: order.transfers[0].end.googlePlaceId,
    name: order.transfers[0].end.name,
    locationCode: order.transfers[0].end.locationCode,
    address: order.transfers[0].end.address,
  };
  const distance = {
    value: order.transfers[0].distance?.value || 0,
    unit: order.transfers[0].distance?.unit || "",
  };
  const vehicle = {
    description: order.transfers[0].vehicle.description,
    seats: order.transfers[0].vehicle.seats[0].count,
    baggages: order.transfers[0].vehicle.baggages.map((baggage) => ({
      count: baggage.count,
      size: baggage.size,
    })),
    image: order.transfers[0].vehicle.imageURL,
  };
  const provider = {
    name: order.transfers[0].serviceProvider.name,
    logo: order.transfers[0].serviceProvider.logoUrl,
    contacts: {
      phoneNumber:
        order.transfers[0].serviceProvider.contacts?.phoneNumber || "",
      email: order.transfers[0].serviceProvider.contacts?.email || "",
    },
    vatRegistrationNumber:
      order.transfers[0].serviceProvider.businessIdentification
        ?.vatRegistrationNumber || "",
  };
  const confirmationCode = order.reference;

  return {
    orderId,
    type,
    start,
    end,
    distance,
    vehicle,
    provider,
    confirmationCode,
  };
};
