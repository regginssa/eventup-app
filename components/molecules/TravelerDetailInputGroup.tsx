import { TDropdownItem } from "@/types";
import { formatBookingDate } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Country } from "react-native-country-picker-modal";
import {
  Button,
  CountryPicker,
  DateTimePicker,
  Dropdown,
  Input,
} from "../common";

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

interface TravelerDetailInputGroupProps {
  id: number;
  title?: string;
  onConfirm: (travelerDetails: TFlightTraveler, id: number) => void;
}

const TravelerDetailInputGroup: React.FC<TravelerDetailInputGroupProps> = ({
  id,
  title,
  onConfirm,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState<TDropdownItem>(genders[0]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [documentType, setDocumentType] = useState<TDropdownItem>(
    documentTypes[0],
  );
  const [birthPlace, setBirthPlace] = useState("");
  const [issuanceLocation, setIssuanceLocation] = useState("");
  const [issuanceDate, setIssuanceDate] = useState(new Date());
  const [number, setNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [issuranceCountry, setIssuranceCountry] = useState<Country | null>(
    null,
  );
  const [validityCountry, setValidityCountry] = useState<Country | null>(null);
  const [nationality, setNationality] = useState<Country | null>(null);

  const validate = () => {
    if (firstName.trim().length === 0) {
      return false;
    }
    if (lastName.trim().length === 0) {
      return false;
    }
    if (!dateOfBirth) {
      return false;
    }
    if (!gender) {
      return false;
    }
    if (email.trim().length === 0) {
      return false;
    }
    if (phone.trim().length === 0) {
      return false;
    }
    if (!documentType) {
      return false;
    }
    if (birthPlace.trim().length === 0) {
      return false;
    }
    if (issuanceLocation.trim().length === 0) {
      return false;
    }
    if (!issuanceDate) {
      return false;
    }
    if (number.trim().length === 0) {
      return false;
    }
    if (!expiryDate) {
      return false;
    }
    if (!issuranceCountry) {
      return false;
    }
    if (!validityCountry) {
      return false;
    }
    if (!nationality) {
      return false;
    }
    return true;
  };

  const handleConfirmInformation = () => {
    if (!validate()) return;

    onConfirm(
      {
        id: id.toString(),
        dateOfBirth: formatBookingDate(dateOfBirth),
        name: { firstName: firstName, lastName: lastName },
        gender: gender.value as string,
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
      },
      id,
    );
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
              color="#9ca3af"
            />
          ) : (
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#9ca3af"
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
