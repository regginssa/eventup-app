import {
  Button,
  Dropdown,
  Input,
  MultiSelectDropdown,
  Textarea,
} from "@/components/common";
import { CreateEventContainer } from "@/components/organisms";
import {
  EVENT_CATEGORIES,
  EVENT_SUB_CATEGORIES,
  EVENT_VENUE_TYPE,
  EVENT_VIBE,
} from "@/constants/events";
import { setNewEvent } from "@/redux/slices/event.slice";
import { RootState } from "@/redux/store";
import { TDropdownItem } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const CreateEventStep1Screen = () => {
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<TDropdownItem | null>(null);
  const [subcategories, setSubcategories] = useState<TDropdownItem[]>([]);
  const [vibe, setVibe] = useState<TDropdownItem[]>([]);
  const [venueType, setVenueType] = useState<TDropdownItem[]>([]);
  const [detail, setDetail] = useState<string>("");

  const [invalidTitle, setInvalidTitle] = useState<boolean>(false);
  const [invalidCategory, setInvalidCategory] = useState<boolean>(false);
  const [invalidDetail, setInvalidDetail] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const { newEvent } = useSelector((state: RootState) => state.event);
  const dispatch = useDispatch();

  const router = useRouter();

  const validate = () => {
    const titleValid = title.trim().length > 0;
    const categoryValid = !!category;
    const detailValid = detail.trim().length > 10;

    setInvalidTitle(!titleValid);
    setInvalidCategory(!categoryValid);
    setInvalidDetail(!detailValid);

    return titleValid && categoryValid && detailValid;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    if (!user?._id) {
      Alert.alert("Error", "Please login to continue");

      const token = await AsyncStorage.getItem("Authorization");
      if (token) {
        await AsyncStorage.removeItem("Authorization");
      }

      router.replace("/start");
    }

    dispatch(
      setNewEvent({
        name: title,
        description: detail,
        type: "user",
        classifications: {
          category: category?.value.toString() || undefined,
          subcategories: subcategories.map((s) => s.value.toString()),
          vibe: vibe.map((v) => v.value.toString()),
          venue: venueType.map((v) => v.value.toString()),
        },
        hoster: user._id as any,
      })
    );
    router.push("/event/create/step2");
  };

  useEffect(() => {
    if (!newEvent) return;

    const { name, description, classifications } = newEvent;

    // Restore simple fields
    setTitle(name || "");
    setDetail(description || "");

    // ---- Restore Category ----
    if (category) {
      const selectedCategory = EVENT_CATEGORIES.find(
        (c) => c.value === classifications?.category
      );
      setCategory(selectedCategory || null);

      // ---- Restore Subcategories ----
      if (selectedCategory && subcategories?.length) {
        const key = selectedCategory.value as keyof typeof EVENT_SUB_CATEGORIES;
        const list = EVENT_SUB_CATEGORIES[key] || [];
        const restored = list.filter((sc: any) =>
          subcategories.includes(sc.value)
        );
        setSubcategories(restored);
      }

      // ---- Restore Vibe ----
      if (selectedCategory && vibe?.length) {
        const key = selectedCategory.value as keyof typeof EVENT_SUB_CATEGORIES;
        const list = EVENT_VIBE[key] || [];
        const restored = list.filter((v: any) => vibe.includes(v.value));
        setVibe(restored);
      }

      // ---- Restore Venue Type ----
      if (selectedCategory && classifications?.venue?.length) {
        const key = selectedCategory.value as keyof typeof EVENT_SUB_CATEGORIES;
        const list = EVENT_VENUE_TYPE[key] || [];
        const restored = list.filter((v: any) =>
          classifications?.venue?.includes(v.value)
        );
        setVenueType(restored);
      }
    }
  }, [newEvent]);

  return (
    <CreateEventContainer
      step={1}
      title="Event details"
      subtitle="Please input your event details"
      onBack={() => router.back()}
    >
      <Input
        type="string"
        label="Event title"
        placeholder="Enter a catchy title for your event"
        icon={
          <MaterialCommunityIcons
            name="calendar-edit-outline"
            size={16}
            color="#4b5563"
          />
        }
        invalid={invalidTitle}
        invalidTxt="Title is invalid"
        className="rounded-md"
        value={title}
        onChange={setTitle}
      />

      <Dropdown
        label="Event category"
        placeholder="Select your event category"
        icon={<MaterialCommunityIcons name="apps" size={16} color="#4b5563" />}
        items={EVENT_CATEGORIES}
        invalid={invalidCategory}
        invalidTxt="Category is required"
        className="rounded-md"
        selectedItem={category}
        onSelect={setCategory}
      />

      <MultiSelectDropdown
        label="Event subcategories"
        placeholder="Select your event subcategories"
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
        placeholder="Select your event vibe types"
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
        selectedItems={vibe}
        onChange={setVibe}
      />

      <MultiSelectDropdown
        label="Event venue types"
        placeholder="Select your event venue types"
        icon={
          <MaterialCommunityIcons name="map-marker" size={16} color="#4b5563" />
        }
        items={
          category?.value
            ? EVENT_VENUE_TYPE[category.value as keyof typeof EVENT_VENUE_TYPE]
            : []
        }
        className="rounded-md"
        direction="up"
        selectedItems={venueType}
        onChange={setVenueType}
      />

      <Textarea
        label="Event description"
        placeholder="Describe your awesome event..."
        invalid={invalidDetail}
        invalidText="Description must be at least 10 characters."
        value={detail}
        onChange={setDetail}
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
        onPress={handleContinue}
      />
    </CreateEventContainer>
  );
};

export default CreateEventStep1Screen;
