import { Button, DateTimePicker } from "@/components/common";
import { CreateEventContainer } from "@/components/organisms";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CreateEventStep3Screen = () => {
  const router = useRouter();

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

    console.log("Image picked", result);

    if (!result.canceled) {
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

    console.log(result);

    if (!result.canceled) {
      const asset = result.assets[0];
      console.log("Picked photo:", asset);
    }
  };

  return (
    <CreateEventContainer
      step={3}
      title="Add Photo"
      subtitle="Upload photos of your event"
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

      {/* Date picker must be here to let user input opening date */}
      <DateTimePicker />

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
        onPress={() => router.push("/event/create/step4")}
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
