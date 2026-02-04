import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "./Modal";

export type TAvatar = {
  type: "image";
  name: string;
  mimeType: string;
  uri: string;
};

interface AvatarProps {
  name?: string;
  source?: string;
  size?: number;
  onChange?: (val: TAvatar) => void;
}

const Avatar: React.FC<AvatarProps> = ({ name, source, size, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const handlePick = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera access is required to take a photo.",
      );
      return;
    }
    setIsOpen(true);
  };

  const handlePhotoPick = async () => {
    setLoading(true);
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("captured image data:", result.assets[0]);
    }

    if (onChange && result?.assets) {
      const asset = result.assets[0];

      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE)
        return Alert.alert(
          "File too large",
          `The file is larger than 5MB. Please select a smaller file.`,
        );

      const avatar = {
        type: "image",
        name: asset.fileName,
        mimeType: asset.mimeType,
        uri: asset.uri,
      };

      onChange(avatar as any);
      setIsOpen(false);
    }

    setLoading(false);
  };

  const handleGalleryPick = async () => {
    setLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("uploaded image data:", result.assets[0]);
    }

    if (onChange && result?.assets) {
      const asset = result.assets[0];

      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE)
        return Alert.alert(
          "File too large",
          `The file is larger than 5MB. Please select a smaller file.`,
        );

      const avatar = {
        type: "image",
        name: asset.fileName,
        mimeType: asset.mimeType,
        uri: asset.uri,
      };

      onChange(avatar as any);
      setIsOpen(false);
    }
    setLoading(false);
  };

  return (
    <View
      className="relative"
      style={{ width: size ?? 208, height: size ?? 208 }}
    >
      <View className="absolute inset-0 rounded-full overflow-hidden border border-gray-200">
        {loading ? (
          <View className="w-full h-full flex items-center justify-center">
            <ActivityIndicator size={24} color="#C427E0" />
          </View>
        ) : source ? (
          <Image source={source} alt={name} style={styles.image} />
        ) : (
          <LinearGradient
            colors={["#C427E0", "#844AFF", "#12A9FF"]}
            style={styles.gradientContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text
              className={`text-white font-poppins-semibold ${
                !size ? "text-7xl" : ""
              }`}
            >
              {name ? name.charAt(0).toUpperCase() : ""}
              {name ? name.charAt(1).toUpperCase() : ""}
            </Text>
          </LinearGradient>
        )}
      </View>
      {onChange && (
        <TouchableOpacity
          activeOpacity={0.8}
          className="absolute right-0 bottom-0 w-12 h-12 bg-white flex items-center justify-center rounded-full"
          onPress={handlePick}
        >
          <MaterialCommunityIcons
            name="cloud-upload-outline"
            size={22}
            color="#374151"
          />
        </TouchableOpacity>
      )}

      <Modal
        title=""
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scrolled={true}
      >
        <View className="w-full flex flex-row items-center gap-4 flex-1">
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-grow flex-shrink basis-0 flex flex-row items-center justify-center gap-2"
            onPress={handlePhotoPick}
          >
            <Feather name="camera" size={18} color="#374151" />
            <Text className="font-poppins-semibold text-sm text-gray-700">
              Take a photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-grow flex-shrink basis-0 flex flex-row items-center justify-center gap-2"
            onPress={handleGalleryPick}
          >
            <Feather name="image" size={18} color="#374151" />
            <Text className="font-poppins-semibold text-sm text-gray-700">
              Choose from gallery
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: "100%",
  },
  gradientContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Avatar;
