import { createEvent } from "@/src/api/services/event";
import {
  Button,
  DateTimePicker,
  TimezonePicker,
} from "@/src/components/common";
import { CreateEventContainer } from "@/src/components/organisms";
import { RootState } from "@/src/store";
import { setNewEvent } from "@/src/store/slices/event.slice";
import { IEvent } from "@/src/types/event";
import { formatBookingDate, formatTime } from "@/src/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const CreateEventStep3Screen = () => {
  const [images, setImages] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [timezone, setTimezone] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { newEvent } = useSelector((state: RootState) => state.event);
  const dispatch = useDispatch();

  const handleGalleryPick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      const validAssets = result.assets.filter((asset) => {
        if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
          Alert.alert(
            "File too large",
            `The file is larger than 5MB. Please select a smaller file.`
          );
          return false;
        }
        return true;
      });

      if (validAssets.length > 0) {
        setImages([...images, ...validAssets.map((asset) => asset.uri)]);
      }
    }
  };

  const handlePhotoPick = async () => {
    // Request camera permission
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the camera is required."
      );
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"], // same as gallery
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const MAX_FILE_SIZE = 5 * 1024 * 1024;

      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
        Alert.alert(
          "File too large",
          "The captured file is larger than 5MB. Please try again with lower quality settings."
        );
        return;
      }

      setImages([...images, asset.uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!startDate) {
      Alert.alert("Error", "Start date is required");
      return false;
    }

    const today = formatBookingDate(new Date());
    const startDateFormatted = formatBookingDate(startDate);

    if (startDateFormatted === today) {
      Alert.alert("Error", "Start date must be in the future");
      return false;
    }

    if (!timezone) {
      Alert.alert("Error", "Timezone is required");
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    const newEventData: IEvent = {
      ...newEvent,
      images,
      dates: {
        ...newEvent?.dates,
        start: {
          date: formatBookingDate(startDate),
          time: formatTime(startDate),
        },
        timezone: timezone || undefined,
      },
    };

    try {
      setLoading(true);

      const response = await createEvent(newEventData);

      if (response.ok) {
        dispatch(setNewEvent(response.data));
        router.push("/event/create/step4");
      }
    } catch (error: any) {
      console.log("[create event] error", error.response.data);
      Alert.alert(
        "Error",
        error.response.data.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newEvent?.dates?.start?.date) {
      setStartDate(new Date(newEvent?.dates?.start?.date));
      setTimezone(newEvent?.dates?.timezone || null);
      setImages(newEvent?.images || []);
    }
  }, [newEvent]);

  return (
    <CreateEventContainer
      step={3}
      title="Add Pictures & Start Date"
      subtitle="Upload pictures of your event"
      onBack={() => router.back()}
    >
      <View className="flex flex-row items-center justify-center gap-[42px]">
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex flex-col gap-1 items-center"
          onPress={handleGalleryPick}
        >
          <LinearGradient
            colors={["#BF28E0", "#FFFFFF", "#17A3FE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.photoBtnGradient}
          >
            <View className="absolute inset-[1px] bg-white flex flex-col items-center justify-center rounded-lg">
              <View
                className="w-[60px] h-[60px] flex flex-col items-center justify-center"
                style={styles.photoBtnInner}
              >
                <MaterialIcons
                  name="add-photo-alternate"
                  size={42}
                  color="#4b5563"
                />
              </View>
            </View>
          </LinearGradient>
          <Text className="font-dm-sans-medium text-sm text-gray-600">
            Upload photos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="flex flex-col gap-1 items-center"
          onPress={handlePhotoPick}
        >
          <LinearGradient
            colors={["#BF28E0", "#FFFFFF", "#17A3FE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.photoBtnGradient}
          >
            <View className="absolute inset-[1px] bg-white flex flex-col items-center justify-center rounded-lg">
              <View
                className="w-[60px] h-[60px] flex flex-col items-center justify-center"
                style={styles.photoBtnInner}
              >
                <MaterialIcons name="camera-alt" size={42} color="#4b5563" />
              </View>
            </View>
          </LinearGradient>
          <Text className="font-dm-sans-medium text-sm text-gray-600">
            Take photo
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex items-center justify-center">
        <Text className="font-dm-sans-medium text-sm text-gray-600">
          You can upload multiple photos.
        </Text>
        <Text className="font-dm-sans-medium text-sm text-gray-600">
          Tap an item to remove it
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row gap-2">
          {images.map((image, index) => (
            <View
              key={index}
              className="w-[100px] h-[100px] relative overflow-hidden rounded-lg bg-white border border-gray-200 mb-3"
            >
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100 }}
                contentFit="cover"
              />
              <TouchableOpacity
                onPress={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-black/50 rounded-full p-1"
              >
                <MaterialIcons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <DateTimePicker
        mode="datetime"
        value={startDate}
        onPick={setStartDate}
        label="Start date"
        placeholder="Select start date"
        bordered
        className="rounded-md"
      />

      <TimezonePicker
        label="Timezone"
        placeholder="Select timezone"
        value={timezone}
        onPick={setTimezone}
        bordered
        className="rounded-md"
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
        onPress={handleContinue}
      />
    </CreateEventContainer>
  );
};

const styles = StyleSheet.create({
  photoBtnGradient: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  photoBtnInner: {
    borderWidth: 2,
    borderStyle: "dotted",
    borderRadius: 10,
    borderColor: "#4b5563",
  },
});

export default CreateEventStep3Screen;
