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

// Amadeus Hotel Offer API response type
export type TAmadeusHotelOffer = {
  type: "hotel-offers";
  hotel: {
    type: "hotel";
    hotelId: string;
    chainCode: string;
    dupeId: string;
    name: string;
    cityCode: string;
    latitude: number;
    longitude: number;
  };
  available: boolean;
  offers: Array<{
    id: string;
    checkInDate: string;
    checkOutDate: string;
    rateCode: string;
    rateFamilyEstimated: {
      code: string;
      type: string;
    };
    room: {
      type: string;
      typeEstimated: {
        category: string;
        beds: number;
        bedType: string;
      };
      description: {
        text: string;
        lang: string;
      };
    };
    guests: {
      adults: number;
    };
    price: {
      currency: string;
      base: string;
      total: string;
      variations: {
        average: {
          base: string;
        };
        changes: Array<{
          startDate: string;
          endDate: string;
          total: string;
        }>;
      };
    };
    policies: {
      paymentType: string;
      cancellation: {
        description: {
          text: string;
        };
        type: string;
      };
    };
    self: string;
  }>;
  self: string;
};
