// Amadeus Flight Offer API response type
export type TAmadeusFlightOffer = {
  id: string;
  itineraries: Array<{
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft?: {
        code: string;
      };
    }>;
  }>;
  price: {
    total: string;
    currency: string;
    base?: string;
    grandTotal?: string;
  };
  numberOfBookableSeats: number;
  travelerPricings?: Array<{
    fareDetailsBySegment?: Array<{
      amenities?: Array<{
        description: string;
        amenityType: string;
        isChargeable?: boolean;
      }>;
    }>;
  }>;
  validatingAirlineCodes?: string[];
};
