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

export type TAmadeusFlightOrder = {
  type: "flight-order";
  id: string;
  queuingOfficeId?: string;
  associatedRecords?: Array<{
    reference: string;
    creationDateTime: string;
    originSystemCode: string;
    flightOfferId: string;
  }>;
  travelers: Array<{
    id: string;
    dateOfBirth: string;
    name: {
      firstName: string;
      lastName: string;
    };
    contact?: {
      phones: Array<{
        countryCallingCode: string;
        number: string;
      }>;
    };
    documents?: Array<{
      documentType: "PASSPORT" | "IDENTITY_CARD" | "VISA" | string;
      number: string;
      expiryDate?: string;
      issuanceCountry: string;
      nationality: string;
      holder?: boolean;
    }>;
  }>;
  flightOffers: Array<{
    id: string;
    type: "flight-offer";
    source?: "GDS" | "NON_GDS" | string;
    itineraries: Array<{
      duration?: string;
      segments: Array<{
        id: string;
        duration?: string;
        aircraft?: {
          code: string;
        };
        numberOfStops?: number;
        blacklistedInEU?: boolean;
        carrierCode: string;
        operating?: {
          carrierCode: string;
        };
        number: string;
        departure: {
          at: string;
          terminal?: string;
          iataCode: string;
        };
        arrival: {
          at: string;
          terminal?: string;
          iataCode: string;
        };
        co2Emissions?: Array<{
          weight: string;
          weightUnit: "KG" | "LB" | string;
          cabin: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST" | string;
        }>;
      }>;
    }>;
    price: {
      grandTotal: string;
      total: string;
      base: string;
      currency: string;
      billingCurrency?: string;
      fees?: Array<{
        type: "SUPPLIER" | "FORM_OF_PAYMENT" | "TICKETING" | string;
        amount: string;
      }>;
      additionalServices?: Array<{
        type: "CHECKED_BAGS" | "SEATS" | "MEALS" | string;
        amount: string;
      }>;
    };
    pricingOptions?: {
      fareType: Array<"PUBLISHED" | "NEGOTIATED" | "CORPORATE" | string>;
      includedCheckedBags?: boolean;
    };
    validatingAirlineCodes?: string[];
    travelerPricings?: Array<{
      travelerId: string;
      fareOption?: "STANDARD" | "INCLUSIVE_TOUR" | "SPANISH_MARKET" | string;
      travelerType:
        | "ADULT"
        | "CHILD"
        | "SEATED_INFANT"
        | "HELD_INFANT"
        | string;
      associatedAdultId?: string;
      price: {
        currency: string;
        total: string;
        base: string;
        taxes?: Array<{
          code: string;
          amount: string;
        }>;
      };
      fareDetailsBySegment?: Array<{
        segmentId: string;
        cabin: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST" | string;
        fareBasis?: string;
        brandedFare?: string;
        class?: string;
        isAllotment?: boolean;
        allotmentDetails?: {
          tourName?: string;
          tourReference?: string;
        };
        sliceDiceIndicator?: string;
        includedCheckedBags?: {
          quantity: number;
        };
        additionalServices?: {
          chargeableCheckedBags?: {
            quantity: number;
            weight?: number;
          };
          chargeableSeatNumber?: string;
        };
      }>;
    }>;
  }>;
  ticketingAggreement?: {
    option: "DELAY_TO_CANCEL" | "IMMEDIATE" | string;
    dateTime?: string;
    delay?: string;
  };
  contacts?: Array<{
    companyName?: string;
    purpose: "STANDARD" | "INVOICE" | "BOOKING_CONTACT" | string;
    phones?: Array<{
      deviceType: "MOBILE" | "LANDLINE" | "FAX" | string;
      countryCallingCode: string;
      number: string;
    }>;
    emailAddress?: string;
    address?: {
      lines: string[];
      postalCode: string;
      cityName: string;
      countryCode: string;
    };
  }>;
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

export type TAmadeusHotelOrder = {
  type: "hotel-order";
  id: string;
  hotelBookings: Array<{
    type: "hotel-booking";
    id: string;
    bookingStatus: "CONFIRMED" | "CANCELLED" | "PENDING" | string;
    hotelProviderInformation?: Array<{
      hotelProviderCode: string;
      confirmationNumber: string;
    }>;
    roomAssociations: Array<{
      hotelOfferId: string;
      guestReferences: Array<{
        guestReference: string;
      }>;
    }>;
    hotelOffer: {
      id: string;
      type: "hotel-offer";
      category?: "TYPE_CONDITIONAL" | "TYPE_GUARANTEED" | string;
      checkInDate: string;
      checkOutDate: string;
      guests: {
        adults: number;
        childAges?: number[];
      };
      policies: {
        cancellations?: Array<{
          amount: string;
          deadline: string;
        }>;
        paymentType: "GUARANTEE" | "DEPOSIT" | "PREPAID" | string;
      };
      price: {
        base: string;
        currency: string;
        sellingTotal: string;
        taxes?: Array<{
          amount: string;
          code: "VALUE_ADDED_TAX" | "CITY_TAX" | "ROOM_TAX" | string;
          currency: string;
          included: boolean;
          pricingFrequency?: "PER_STAY" | "PER_NIGHT" | string;
          pricingMode?: "PER_PRODUCT" | "PER_PERSON" | string;
        }>;
        total: string;
        variations?: {
          changes?: Array<{
            endDate: string;
            startDate: string;
            base: string;
            currency: string;
            total?: string;
          }>;
          average?: {
            base: string;
          };
        };
      };
      rateCode: string;
      room: {
        description: {
          lang: string;
          text: string;
        };
        type: string;
        typeEstimated?: {
          category: string;
          beds: number;
          bedType: string;
        };
      };
      roomQuantity: number;
    };
    hotel: {
      hotelId: string;
      chainCode: string;
      name: string;
      self?: string;
      cityCode?: string;
      latitude?: number;
      longitude?: number;
      address?: {
        countryCode: string;
        postalCode: string;
        stateCode?: string;
        cityName: string;
        lines: string[];
      };
    };
    payment: {
      method: "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | string;
      paymentCard?: {
        paymentCardInfo: {
          vendorCode: string;
          cardNumber: string;
          expiryDate: string;
          holderName: string;
        };
      };
    };
    travelAgentId?: string;
  }>;
  guests: Array<{
    tid: number;
    id: number;
    title: "MR" | "MRS" | "MS" | "MISS" | string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }>;
  associatedRecords?: Array<{
    reference: string;
    originSystemCode: "GDS" | "NON_GDS" | string;
    creationDateTime?: string;
  }>;
  self?: string;
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
    dateTime?: string;
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

export type TAmadeusTransferOrder = {
  type: "transfer-order";
  id: string;
  reference: string;
  agency: {
    contacts: {
      email: {
        address: string;
      };
    }[];
  };
  transfers: Array<{
    status: string;
    confirmNbr: string;
    note?: string;
    methodOfPayment: string;
    offerId: string;
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
        uicCode?: string;
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
        address?: {
          line: string;
          zip?: string;
          countryCode: string;
          cityName: string;
          stateCode?: string;
        };
      };
      settings?: string[];
      businessIdentification?: {
        vatRegistrationNumber?: string;
      };
    };
    partnerInfo?: {
      serviceProvider: {
        code: string;
        name: string;
        logoUrl?: string;
        termsUrl?: string;
        isPreferred?: boolean;
        contacts?: {
          phoneNumber?: string;
          email?: string;
          address?: {
            line: string;
            zip?: string;
            countryCode: string;
            cityName: string;
            stateCode?: string;
          };
        };
        businessIdentification?: {
          vatRegistrationNumber?: string;
        };
      };
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
    cancellationRules?: Array<{
      feeType: "PERCENTAGE" | "FIXED" | string;
      feeValue: string;
      metricType: "DAYS" | "HOURS" | string;
      metricMin: string;
      metricMax: string;
    }>;
    distance?: {
      value: number;
      unit: string;
    };
  }>;
  passengerCharacteristics?: Array<{
    passengerTypeCode: "ADT" | "CHD" | "INF" | string;
    age: number;
  }>;
  passengers: Array<{
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
  }>;
};
