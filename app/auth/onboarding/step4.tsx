import { updateUser } from "@/src/api/services/user";
import { Button, MultiSelectDropdown } from "@/src/components/common";
import Dropdown from "@/src/components/common/Dropdown";
import { OnboardingContainer } from "@/src/components/organisms";
import {
  EVENT_CATEGORIES,
  EVENT_LOCATION_TYPES,
  EVENT_SUB_CATEGORIES,
  EVENT_VENUE_TYPE,
  EVENT_VIBE,
} from "@/src/constants/events";
import { setAuthUser } from "@/src/store/slices/auth.slice";

import { RootState } from "@/src/store";
import { TDropdownItem } from "@/src/types";
import { IUser } from "@/src/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const OnboardingStep4Screen = () => {
  const [category, setCategory] = useState<TDropdownItem | null>(null);
  const [subcategories, setSubcategories] = useState<TDropdownItem[]>([]);
  const [vibes, setVibes] = useState<TDropdownItem[]>([]);
  const [venueTypes, setVenueTypes] = useState<TDropdownItem[]>([]);
  const [location, setLocation] = useState<TDropdownItem | null>(null);
  const [invalidCategory, setInvalidCategory] = useState<boolean>(false);
  const [invalidSub, setInvalidSub] = useState<boolean>(false);
  const [invalidVibe, setInvalidVibe] = useState<boolean>(false);
  const [invalidVenue, setInvalidVenue] = useState<boolean>(false);
  const [invalidLocation, setInvalidLocation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const validate = () => {
    setInvalidCategory(!category);
    setInvalidSub(subcategories.length === 0);
    setInvalidVibe(vibes.length === 0);
    setInvalidVenue(venueTypes.length === 0);
    setInvalidLocation(!location);

    return !(
      !category ||
      subcategories.length === 0 ||
      vibes.length === 0 ||
      venueTypes.length === 0 ||
      !location
    );
  };

  const handleSubmit = async () => {
    if (!validate() || !user?._id) return;

    try {
      setLoading(true);

      const subs: string[] = subcategories.map((s) => s.value as string);
      const vis: string[] = vibes.map((v) => v.value as string);
      const venues: string[] = venueTypes.map((v) => v.value as string);

      const updates: IUser = {
        ...user,
        preferred: {
          category: category?.value as string,
          subcategories: subs,
          vibe: vis,
          venueType: venues,
          location: location?.value as any,
        },
      };

      const response = await updateUser(user._id, updates);

      if (response.ok) {
        dispatch(setAuthUser(response.data));

        router.replace("/auth/onboarding/step5");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingContainer
      step={4}
      title="Personalize your party"
      subtitle="Share your favorite vibes and we’ll match you with the perfect events"
      onBack={() => router.back()}
    >
      <View className="w-full gap-5">
        <Dropdown
          label="Event category"
          placeholder="Select your preferred event category"
          icon={
            <MaterialCommunityIcons name="apps" size={16} color="#4b5563" />
          }
          items={EVENT_CATEGORIES}
          className="rounded-md"
          selectedItem={category}
          onSelect={setCategory}
        />

        <MultiSelectDropdown
          label="Event subcategories"
          placeholder="Select your preferred event subcategories"
          icon={
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={16}
              color="#4b5563"
            />
          }
          items={
            category?.value
              ? EVENT_SUB_CATEGORIES[
                  category.value as keyof typeof EVENT_SUB_CATEGORIES
                ]
              : []
          }
          className="rounded-md"
          selectedItems={subcategories}
          onChange={setSubcategories}
        />

        <MultiSelectDropdown
          label="Event vibe types"
          placeholder="Select your preferred event vibe types"
          icon={
            <MaterialCommunityIcons
              name="emoticon-outline"
              size={16}
              color="#4b5563"
            />
          }
          items={
            category?.value
              ? EVENT_VIBE[category.value as keyof typeof EVENT_VIBE]
              : []
          }
          className="rounded-md"
          selectedItems={vibes}
          onChange={setVibes}
        />

        <MultiSelectDropdown
          label="Event venue types"
          placeholder="Select your preferred event venue types"
          icon={
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color="#4b5563"
            />
          }
          items={
            category?.value
              ? EVENT_VENUE_TYPE[
                  category.value as keyof typeof EVENT_VENUE_TYPE
                ]
              : []
          }
          className="rounded-md"
          direction="up"
          selectedItems={venueTypes}
          onChange={setVenueTypes}
        />

        <Dropdown
          label="Event location"
          placeholder="Select your preferred event location"
          icon={
            <MaterialCommunityIcons
              name="map-check-outline"
              size={16}
              color="#4b5563"
            />
          }
          items={EVENT_LOCATION_TYPES}
          className="rounded-md"
          direction="up"
          selectedItem={location}
          onSelect={setLocation}
        />
      </View>

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

export default OnboardingStep4Screen;
