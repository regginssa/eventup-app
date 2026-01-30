import {
  Button,
  CountryPicker,
  Dropdown,
  LocationPicker,
  RegionPicker,
} from "@/components/common";
import { CreateEventContainer } from "@/components/organisms";
import { EVENT_ENTRY_TYPES } from "@/constants/events";
import {
  CURRENCIES,
  EUR_VALUES,
  PLN_VALUES,
  USD_VALUES,
} from "@/constants/values";
import { RootState } from "@/store";
import { setNewEvent } from "@/store/slices/event.slice";
import { TCoordinate, TDropdownItem, TLocation } from "@/types";
import { IEvent } from "@/types/event";
import { RegionType } from "@/types/location.types";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Country } from "react-native-country-picker-modal";
import { useDispatch, useSelector } from "react-redux";

const CreateEventStep2Screen = () => {
  const [country, setCountry] = useState<Country | null>(null);
  const [region, setRegion] = useState<RegionType | null>(null);
  const [address, setAddress] = useState<TLocation | null>(null);
  const [entryType, setEntryType] = useState<TDropdownItem>(
    EVENT_ENTRY_TYPES[0]
  );
  const [currency, setCurrency] = useState<TDropdownItem>(CURRENCIES[0]);
  const [fee, setFee] = useState<TDropdownItem>(USD_VALUES[0]);
  const [invalidCountry, setInvalidCountry] = useState<boolean>(false);
  const [invalidRegion, setInvalidRegion] = useState<boolean>(false);
  const [invalidAddress, setInvalidAddress] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { newEvent } = useSelector((state: RootState) => state.event);
  const dispatch = useDispatch();

  const router = useRouter();

  const validate = () => {
    const countryValid = !!country;
    const regionValid = !!region;
    const addressValid = !!address;

    setInvalidCountry(!countryValid);
    setInvalidRegion(!regionValid);
    setInvalidAddress(!addressValid);

    return countryValid && regionValid && addressValid;
  };

  const handleContinue = () => {
    if (!validate()) return;

    const updates: IEvent = {
      ...newEvent,
      location: {
        country: {
          name: country?.name.toString(),
          code: country?.cca2,
        },
        state: {
          name: region?.name,
          code: region?.code,
        },
        city: {
          name: address?.cityName,
          code: undefined,
        },
        coordinate: address?.coordinate as TCoordinate,
      },
      fee: {
        type: entryType.value as any,
        amount: Number(fee.value),
        currency: currency.value as string,
      },
    };

    dispatch(setNewEvent(updates));

    router.push("/event/create/step3");
  };

  useEffect(() => {
    switch (currency.value) {
      case "usd":
        setFee(USD_VALUES[0]);
        break;
      case "eur":
        setFee(EUR_VALUES[0]);
        break;
      case "pln":
        setFee(PLN_VALUES[0]);
        break;
      default:
        break;
    }
  }, [currency]);

  return (
    <CreateEventContainer
      step={2}
      title="Location & Payment"
      subtitle="Where will your party take place?"
      onBack={() => router.back()}
    >
      <CountryPicker
        label="Country"
        placeholder="Select country"
        invalid={invalidCountry}
        invalidText="Country is invalid"
        value={country}
        onPick={setCountry}
      />
      <RegionPicker
        label="Region"
        placeholder="Select country first"
        countryCode={country?.cca2}
        invalid={invalidRegion}
        invalidText="Region is invalid"
        value={region}
        onPick={setRegion}
      />
      <LocationPicker
        label="Venue address"
        placeholder="Select country and region first"
        country={country?.cca2}
        region={region?.name}
        city={region?.code}
        invalid={invalidAddress}
        invalidText="Invalid address"
        value={address}
        onPick={setAddress}
      />
      <Dropdown
        label="Entry type"
        placeholder="Select your entry type"
        icon={<MaterialIcons name="paid" size={16} color="#4b5563" />}
        items={EVENT_ENTRY_TYPES}
        className="rounded-md"
        selectedItem={entryType}
        onSelect={setEntryType}
      />
      {entryType.value === "paid" && (
        <>
          <Dropdown
            label="Currency"
            placeholder="Select your preferred currency"
            items={CURRENCIES}
            className="rounded-md"
            selectedItem={currency}
            onSelect={setCurrency}
          />
          <Dropdown
            label="Entry fee"
            placeholder="Select your preferred currency"
            items={
              currency.value === "usd"
                ? USD_VALUES
                : currency.value === "eur"
                ? EUR_VALUES
                : PLN_VALUES
            }
            className="rounded-md"
            direction="up"
            selectedItem={fee}
            onSelect={setFee}
          />
        </>
      )}
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
        onPress={handleContinue}
      />
    </CreateEventContainer>
  );
};

export default CreateEventStep2Screen;
