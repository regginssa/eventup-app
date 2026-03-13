import UserAPI from "@/api/services/user";
import { Button, MultiSelectDropdown } from "@/components/common";
import Dropdown from "@/components/common/Dropdown";
import { OnboardingContainer } from "@/components/organisms";
import {
  EVENT_CATEGORIES,
  EVENT_LOCATION_TYPES,
  EVENT_SUB_CATEGORIES,
  EVENT_VENUE_TYPE,
  EVENT_VIBE,
} from "@/constants/events";

import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { TDropdownItem } from "@/types";
import { IUser } from "@/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

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
  const { user, setAuthUser } = useAuth();
  const toast = useToast();

  const validate = () => {
    setInvalidCategory(!category);
    setInvalidSub(subcategories.length === 0);
    setInvalidVibe(vibes.length === 0);
    setInvalidVenue(venueTypes.length === 0);
    setInvalidLocation(!location);

    return !(!category || !location);
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

      const response = await UserAPI.update(user._id, updates);

      if (response.ok) {
        setAuthUser(response.data);
        router.replace("/auth/onboarding/step5");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message);
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
