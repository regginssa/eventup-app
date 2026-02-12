import { TDropdownItem } from "@/types";
import { formatBookingDate } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Country } from "react-native-country-picker-modal";
import {
  Button,
  CountryPicker,
  DateTimePicker,
  Dropdown,
  Input,
} from "../common";
import { useBooking } from "../providers/BookingProvider";
import HotelOfferGroup from "./HotelOfferGroup";

const documentTypes = [
  { label: "PASSPORT", value: "passport" },
  { label: "IDENTITY CARD", value: "identity_card" },
  { label: "VISA", value: "visa" },
  { label: "KNOWN TRAVELER", value: "known_traveler" },
  { label: "REDRESS", value: "redress" },
];

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export type TFlightTraveler = {
  id: string;
  dateOfBirth: string;
  name: {
    firstName: string;
    lastName: string;
  };
  gender: string;
  contact: {
    emailAddress: string;
    phones: [
      {
        deviceType: string;
        countryCallingCode: string;
        number: string;
      },
    ];
  };
  document: {
    type: string;
    number: string;
    country: string;
    issuanceDate: string;
    expiryDate: string;
  };
};

export type THotelTraveler = {
  info: {
    tid: number;
    title: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  offerId: string;
};

export type TTraveler = {
  flightTravelerDetails: TFlightTraveler;
  hotelTravelerDetails: THotelTraveler;
};

interface TravelerDetailInputGroupProps {
  id: number;
  title?: string;
  onConfirm: (travelerDetails: TTraveler) => void;
}

const TravelerDetailInputGroup: React.FC<TravelerDetailInputGroupProps> = ({
  id,
  title,
  onConfirm,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("Vladislav");
  const [lastName, setLastName] = useState("Gostiuc");
  const [dateOfBirth, setDateOfBirth] = useState(new Date("1990-01-01"));
  const [gender, setGender] = useState<TDropdownItem>(genders[0]);
  const [email, setEmail] = useState("vladislav.gostiuc@gmail.com");
  const [phone, setPhone] = useState("+37369123456");
  const [documentType, setDocumentType] = useState<TDropdownItem>(
    documentTypes[0],
  );
  const [birthPlace, setBirthPlace] = useState("Madrid");
  const [issuanceLocation, setIssuanceLocation] = useState("Madrid");
  const [issuanceDate, setIssuanceDate] = useState(new Date("2020-01-01"));
  const [number, setNumber] = useState("123456790");
  const [expiryDate, setExpiryDate] = useState(new Date("2028-01-01"));
  const [issuranceCountry, setIssuranceCountry] = useState<Country | null>(
    null,
  );
  const [validityCountry, setValidityCountry] = useState<Country | null>(null);
  const [nationality, setNationality] = useState<Country | null>(null);
  const [selectedHotelOfferIndex, setSelectedHotelOfferIndex] = useState(0);

  const { hotel } = useBooking();

  const validate = () => {
    if (firstName.trim().length === 0) {
      Alert.alert("First Name is required");
      return false;
    }
    if (lastName.trim().length === 0) {
      Alert.alert("Last Name is required");
      return false;
    }
    if (!dateOfBirth) {
      Alert.alert("Date of Birth is required");
      return false;
    }
    if (!gender) {
      Alert.alert("Gender is required");
      return false;
    }
    if (email.trim().length === 0) {
      Alert.alert("Email is required");
      return false;
    }
    if (phone.trim().length === 0) {
      Alert.alert("Phone is required");
      return false;
    }
    if (!documentType) {
      Alert.alert("Document Type is required");
      return false;
    }
    if (birthPlace.trim().length === 0) {
      Alert.alert("Birth Place is required");
      return false;
    }
    if (issuanceLocation.trim().length === 0) {
      Alert.alert("Issuance Location is required");
      return false;
    }
    if (!issuanceDate) {
      Alert.alert("Issuance Date is required");
      return false;
    }
    if (number.trim().length === 0) {
      Alert.alert("Number is required");
      return false;
    }
    if (!expiryDate) {
      Alert.alert("Expiry Date is required");
      return false;
    }
    if (!issuranceCountry) {
      Alert.alert("Issurance Country is required");
      return false;
    }
    if (!validityCountry) {
      Alert.alert("Validity Country is required");
      return false;
    }
    if (!nationality) {
      Alert.alert("Nationality is required");
      return false;
    }
    return true;
  };

  const handleConfirmInformation = () => {
    if (!validate()) return;

    const flightTravelerDetails: TFlightTraveler = {
      id: id.toString(),
      dateOfBirth: formatBookingDate(dateOfBirth),
      name: { firstName: firstName, lastName: lastName },
      gender: gender.label.toUpperCase() as string,
      contact: {
        emailAddress: email,
        phones: [
          { deviceType: "MOBILE", countryCallingCode: "1", number: phone },
        ],
      },
      document: {
        type: documentType.value as string,
        number: number,
        country: issuranceCountry?.cca2 as string,
        issuanceDate: formatBookingDate(issuanceDate),
        expiryDate: formatBookingDate(expiryDate),
      },
    };

    const hotelTravelerDetails: THotelTraveler = {
      info: {
        tid: Number(id),
        title: gender.value === "male" ? "MR" : ("MRS" as string),
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
      },
      offerId: hotel?.offers[0].offers[selectedHotelOfferIndex].id as string,
    };

    onConfirm({
      flightTravelerDetails,
      hotelTravelerDetails,
    });

    setIsOpen(false);
  };

  return (
    <>
      {title && (
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex flex-row items-ceneter justify-between"
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text className="font-poppins-semibold text-sm text-gray-800">
            {title}
          </Text>
          {isOpen ? (
            <MaterialCommunityIcons
              name="chevron-up"
              size={24}
              color="#4b5563"
            />
          ) : (
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#4b5563"
            />
          )}
        </TouchableOpacity>
      )}
      {isOpen && (
        <View className="w-full gap-2">
          <Input
            type="string"
            label="First Name"
            placeholder="Enter your first name"
            bordered
            className="rounded-md"
            value={firstName}
            onChange={setFirstName}
          />
          <Input
            type="string"
            label="Last Name"
            placeholder="Enter your last name"
            bordered
            className="rounded-md"
            value={lastName}
            onChange={setLastName}
          />

          <DateTimePicker
            mode="date"
            label="Date of Birth"
            value={dateOfBirth}
            bordered
            className="rounded-md"
            onPick={setDateOfBirth}
          />

          <Dropdown
            label="Gender"
            items={genders}
            selectedItem={gender}
            onSelect={setGender}
            bordered
            className="rounded-md"
          />

          <Input
            type="string"
            label="Email"
            placeholder="jhondoe@example.com"
            value={email}
            onChange={setEmail}
            bordered
            className="rounded-md"
          />
          <Input
            type="string"
            label="Phone"
            placeholder="+1234567890"
            value={phone}
            onChange={setPhone}
            bordered
            className="rounded-md"
          />

          <Dropdown
            label="Document Type"
            items={documentTypes}
            selectedItem={documentType}
            onSelect={setDocumentType}
            bordered
            className="rounded-md"
          />

          <Input
            type="string"
            label="Birth Place"
            placeholder="e,g Madrid"
            bordered
            className="rounded-md"
            value={birthPlace}
            onChange={setBirthPlace}
          />
          <Input
            type="string"
            label="Issuance Location"
            placeholder="e,g Madrid"
            bordered
            className="rounded-md"
            value={issuanceLocation}
            onChange={setIssuanceLocation}
          />
          <DateTimePicker
            mode="date"
            label="Issuance Date"
            bordered
            className="rounded-md"
            value={issuanceDate}
            onPick={setIssuanceDate}
          />
          <Input
            type="string"
            label="Number"
            placeholder="1234567890"
            bordered
            className="rounded-md"
            value={number}
            onChange={setNumber}
          />
          <DateTimePicker
            mode="date"
            label="Expiry Date"
            bordered
            className="rounded-md"
            value={expiryDate}
            onPick={setExpiryDate}
          />
          <CountryPicker
            label="Issurance Country"
            placeholder="Select your country"
            value={issuranceCountry}
            onPick={setIssuranceCountry}
            bordered
            className="rounded-md"
          />
          <CountryPicker
            label="Validity Country"
            placeholder="Select your country"
            value={validityCountry}
            onPick={setValidityCountry}
            bordered
            className="rounded-md"
          />
          <CountryPicker
            label="Nationality"
            placeholder="Select your country"
            value={nationality}
            onPick={setNationality}
            bordered
            className="rounded-md"
          />

          <HotelOfferGroup
            offers={hotel?.offers ? hotel?.offers[0].offers : []}
            selectedIndex={selectedHotelOfferIndex}
            onSelect={setSelectedHotelOfferIndex}
          />

          <Button
            type="primary"
            label="Confirm Information"
            buttonClassName="rounded-md h-12 mt-2"
            onPress={handleConfirmInformation}
          />
        </View>
      )}
    </>
  );
};

export default TravelerDetailInputGroup;
