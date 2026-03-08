import UserAPI from "@/api/services/user";
import {
  Button,
  CountryPicker,
  Dropdown,
  LocationPicker,
  PhoneInput,
  RegionPicker,
} from "@/components/common";
import { OnboardingContainer } from "@/components/organisms";
import { useAuth } from "@/components/providers/AuthProvider";
import { TCoordinate, TDropdownItem, TLocation } from "@/types";
import { Country, RegionType } from "@/types/location.types";
import { IUser } from "@/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const genders = [
  { label: "Male", value: "mr" },
  { label: "Female", value: "ms" },
];

const OnboardingStep1Screen = () => {
  const [selectedGender, setSelectedGender] = useState<TDropdownItem>(
    genders[0],
  );
  const [country, setCountry] = useState<Country | null>(null);
  const [region, setRegion] = useState<RegionType | null>(null);
  const [address, setAddress] = useState<TLocation | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [invalidCountry, setInvalidCountry] = useState<boolean>(false);
  const [invalidRegion, setInvalidRegion] = useState<boolean>(false);
  const [invalidAddress, setInvalidAddress] = useState<boolean>(false);
  const [invalidPhone, setInvalidPhone] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { user, setAuthUser } = useAuth();

  const validate = () => {
    const phoneNumber = parsePhoneNumberFromString(
      phone,
      (country?.cca2 as any) || "US",
    );

    if (!phoneNumber || !phoneNumber.isValid()) {
      setInvalidPhone(true);
    } else {
      setInvalidPhone(false);
    }
    setInvalidCountry(!country);
    setInvalidRegion(!region);
    setInvalidAddress(!address);

    return !(
      !phoneNumber ||
      !phoneNumber.isValid() ||
      !country ||
      !region ||
      !address
    );
  };

  const handleSubmit = async () => {
    if (!validate() || !user?._id) return;

    try {
      setLoading(true);

      const updates: IUser = {
        ...user,
        location: {
          country: {
            name: country?.name as any,
            code: country?.cca2,
          },
          region: {
            name: region?.name,
            code: region?.code,
          },
          city: {
            name: address?.cityName,
          },
          address: address?.description,
          coordinate: address?.coordinate as TCoordinate,
        },
        gender: selectedGender.value as any,
        phone: `+${country?.callingCode[0]}${phone}`,
      };

      console.log(updates.phone);

      const response = await UserAPI.update(user._id, updates);

      if (response.ok) {
        setAuthUser(response.data);
        router.replace("/auth/onboarding/step2");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRegion(null);
    setAddress(null);
  }, [country]);

  useEffect(() => {
    setAddress(null);
  }, [region]);

  return (
    <OnboardingContainer
      step={1}
      title="Personal details"
      subtitle="Tell us a bit about yourself"
      onBack={() => router.replace("/start")}
    >
      <Dropdown
        label="Gender"
        placeholder="Gender"
        items={genders}
        icon={
          <MaterialCommunityIcons
            name="account-outline"
            size={16}
            color="#4b5563"
          />
        }
        selectedItem={selectedGender}
        onSelect={setSelectedGender}
      />
      <CountryPicker
        label="Country"
        placeholder="Select your country"
        invalid={invalidCountry}
        invalidText="Invalid country"
        value={country}
        onPick={setCountry}
      />
      <RegionPicker
        label="Region"
        placeholder="Select your country first"
        countryCode={country?.cca2}
        invalid={invalidRegion}
        invalidText="Invalid region"
        value={region}
        onPick={setRegion}
      />
      <LocationPicker
        label="Address"
        placeholder="Select your country and region first"
        country={country?.cca2}
        region={region?.name}
        city={region?.code}
        invalid={invalidAddress}
        invalidText="Invalid address"
        value={address}
        onPick={setAddress}
      />

      <PhoneInput
        label="Phone number"
        placeholder="Select your country first"
        countryCode={country?.cca2}
        invalid={invalidPhone}
        invalidTxt="Invalid phone number"
        value={phone}
        onChange={setPhone}
      />

      <Button
        type="primary"
        label="Continue"
        icon={
          <MaterialCommunityIcons
            name="arrow-right-thin"
            size={20}
            color="white"
          />
        }
        iconPosition="right"
        buttonClassName="h-12"
        loading={loading}
        onPress={handleSubmit}
      />
    </OnboardingContainer>
  );
};

export default OnboardingStep1Screen;
