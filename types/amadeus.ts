import { TFlightTraveler } from "@/components/molecules/TravelerDetailInputGroup";

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

export type TAmadeusFlightBookingRequest = {
  flightOffers: TAmadeusFlightOffer[];
  travelers: TFlightTraveler[];
  remarks: {
    general: {
      subType: string;
      text: string;
    }[];
  };
  // ticketingAgreement: {
  //   option: "DELAY_TO_CANCEL";
  //   delay: "6D";
  // };
  contacts: {
    addresseeName: {
      firstName: string;
      lastName: string;
    };
    companyName: string;
    purpose: string;
    phones: {
      deviceType: string;
      countryCallingCode: string;
      number: string;
    }[];
    emailAddress: string;
    address: {
      lines: string[];
      postalCode: string;
      cityName: string;
      countryCode: string;
    };
  }[];
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
    address: {
      countryCode: string;
      postalCode: string;
      stateCode: string;
      cityName: string;
      lines: string[];
    };
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

// Amadeus Hotel Booking API request type
export type TAmadeusHotelBookingRequest = {
  guests: {
    tid: number;
    title: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }[];
  travelAgent: {
    contact: {
      email: string;
    };
  };
  roomAssociations: {
    guestReferences: {
      guestReference: string;
    }[];
    hotelOfferId: string;
  }[];
  payment: {
    method: string;
    paymentCard: {
      paymentCardInfo: {
        vendorCode: string;
        cardNumber: string;
        expiryDate: string;
        holderName: string;
      };
    };
  };
};

// Amadeus Transfer Offer API response type
export type TAmadeusTransferOffer = {
  type: "transfer-offer";
  id: string;
  transferType: "PRIVATE" | "SHARED" | string;
  start: {
    dateTime: string;
    locationCode: string;
  };
  end: {
    address?: {
      line: string;
      zip?: string;
      countryCode: string;
      cityName: string;
      latitude: number;
      longitude: number;
    };
    googlePlaceId?: string;
    name?: string;
    locationCode?: string;
  };
  stopOvers?: Array<{
    duration: string;
    sequenceNumber: number;
    location: {
      locationCode?: string;
      address?: {
        line: string;
        zip?: string;
        countryCode: string;
        cityName: string;
        latitude: number;
        longitude: number;
      };
      googlePlaceId?: string;
      name?: string;
    };
  }>;
  vehicle: {
    code: string;
    category: string;
    description: string;
    seats: Array<{
      count: number;
    }>;
    baggages: Array<{
      count: number;
      size: string;
    }>;
    imageURL?: string;
  };
  serviceProvider: {
    code: string;
    name: string;
    logoUrl?: string;
    termsUrl?: string;
    contacts?: {
      phoneNumber?: string;
      email?: string;
    };
    settings?: string[];
  };
  quotation: {
    monetaryAmount: string;
    currencyCode: string;
    isEstimated: boolean;
    base?: {
      monetaryAmount: string;
    };
    discount?: {
      monetaryAmount: string;
    };
    fees?: Array<{
      indicator: string;
      monetaryAmount: string;
    }>;
    totalTaxes?: {
      monetaryAmount: string;
    };
    totalFees?: {
      monetaryAmount: string;
    };
  };
  converted?: {
    monetaryAmount: string;
    currencyCode: string;
    isEstimated: boolean;
    base?: {
      monetaryAmount: string;
    };
    discount?: {
      monetaryAmount: string;
    };
    fees?: Array<{
      indicator: string;
      monetaryAmount: string;
    }>;
    totalTaxes?: {
      monetaryAmount: string;
    };
    totalFees?: {
      monetaryAmount: string;
    };
  };
  extraServices?: Array<{
    code: string;
    itemId: string;
    description: string;
    quotation: {
      monetaryAmount: string;
      currencyCode: string;
      base?: {
        monetaryAmount: string;
      };
      totalTaxes?: {
        monetaryAmount: string;
      };
    };
    converted?: {
      monetaryAmount: string;
      currencyCode: string;
      base?: {
        monetaryAmount: string;
      };
      totalTaxes?: {
        monetaryAmount: string;
      };
    };
    isBookable: boolean;
    taxIncluded: boolean;
    includedInTotal: boolean;
  }>;
  equipment?: Array<{
    code: string;
    description: string;
    quotation: {
      monetaryAmount: string;
      currencyCode: string;
      base?: {
        monetaryAmount: string;
      };
      totalTaxes?: {
        monetaryAmount: string;
      };
    };
    converted?: {
      monetaryAmount: string;
      currencyCode: string;
      base?: {
        monetaryAmount: string;
      };
      totalTaxes?: {
        monetaryAmount: string;
      };
    };
    isBookable: boolean;
    taxIncluded: boolean;
    includedInTotal: boolean;
  }>;
  cancellationRules?: Array<{
    feeType: "PERCENTAGE" | "FIXED" | string;
    feeValue: string;
    metricType: "DAYS" | "HOURS" | string;
    metricMin: string;
    metricMax: string;
  }>;
  methodsOfPaymentAccepted?: string[];
  discountCodes?: Array<{
    type: string;
    value: string;
  }>;
  distance?: {
    value: number;
    unit: "KM" | "MI" | string;
  };
  startConnectedSegment?: {
    transportationType: "FLIGHT" | "TRAIN" | string;
    transportationNumber: string;
    departure: {
      localDateTime: string;
      iataCode: string;
    };
    arrival: {
      localDateTime: string;
      iataCode: string;
    };
  };
  passengerCharacteristics?: Array<{
    passengerTypeCode: "ADT" | "CHD" | "INF" | string;
    age: number;
  }>;
};

export type TAmadeusTransferBookingRequest = {
  id: string;
  passengers: {
    firstName: string;
    lastName: string;
    title: string;
    contacts: {
      phoneNumber: string;
      email: string;
    };
    billingAddress: {
      line: string;
      zip: string;
      countryCode: string;
      cityName: string;
    };
  }[];
  payment: {
    methodOfPayment: string;
    creditCard: {
      number: string;
      holderName: string;
      vendorCode: string;
      expiryDate: string;
      cvv: string;
    };
  };
  extraServices?: {
    code: string;
    itemId: string;
  }[];
  equipment?: {
    code: string;
  }[];
  corporation?: {
    address: {
      line: string;
      zip: string;
      countryCode: string;
      cityName: string;
    };
    info: {
      AU: string;
      CE: string;
    };
  };
  startConnectedSegment?: {
    transportationType: string;
    transportationNumber: string;
    departure: {
      uicCode?: string;
      iataCode: string;
      localDateTime: string;
    };
    arrival: {
      uicCode?: string;
      iataCode: string;
      localDateTime: string;
    };
  };
  endConnectedSegment?: {
    transportationType: string;
    transportationNumber: string;
    departure: {
      uicCode: string;
      iataCode: string;
      localDateTime: string;
    };
    arrival: {
      uicCode: string;
      iataCode: string;
      localDateTime: string;
    };
  };
  agency?: {
    contacts: {
      email: {
        address: string;
      };
    }[];
  };
};
