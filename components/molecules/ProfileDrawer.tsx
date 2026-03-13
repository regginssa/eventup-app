import { IUser } from "@/types/user";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Drawer } from "../common";
import { useAuth } from "../providers/AuthProvider";

const LogoImage = require("@/assets/images/logo.png");
const VerifiedBadge = require("@/assets/images/icons/verified_badge.png");

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Header = ({ onClose }: { onClose: () => void }) => {
  return (
    <View className="w-full flex flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-2">
        <Image source={LogoImage} alt="logo" style={styles.logo} />
        <Text className={`font-poppins-semibold text-gray-800`}>
          Charlie Unicorn AI
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center`}
        onPress={onClose}
      >
        <Entypo name="cross" size={16} color="#1f2937" />
      </TouchableOpacity>
    </View>
  );
};

const EmptyUserData = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-1 items-center justify-center gap-2">
        <MaterialCommunityIcons
          name="emoticon-sad-outline"
          size={48}
          color="#1f2937"
        />
        <Text className="text-gray-800 font-poppins-semibold">No Data</Text>
      </View>
    </View>
  );
};

const Profile = ({ user, onClose }: { user: IUser; onClose: () => void }) => {
  const [signOutLoading, setSignOutLoading] = useState<boolean>(false);

  const router = useRouter();

  const items = [
    {
      label: "Edit profile",
      icon: <FontAwesome name="edit" size={20} color="#374151" />,
      href: `/profile/`,
      params: { id: user._id },
    },
    {
      label: "Verify Identity",
      icon: <FontAwesome name="id-card-o" size={20} color="#374151" />,
      href: "/auth/onboarding/step3",
      params: { from: "/home" },
    },
    {
      label: "Tickets",
      icon: <FontAwesome name="ticket" size={20} color="#374151" />,
      badge: user.tickets.length.toString(),
      href: "/mine/tickets",
    },
    {
      label: "Support",
      icon: <FontAwesome5 name="question-circle" size={20} color="#374151" />,
      href: "/contact-us",
    },
    {
      label: "About us",
      icon: <AntDesign name="info-circle" size={20} color="#374151" />,
      href: "/",
    },
  ];

  const handleSignOut = async () => {
    setSignOutLoading(true);
    const token = await AsyncStorage.getItem("Authorization");

    if (token) {
      await AsyncStorage.removeItem("Authorization");
    }
    setSignOutLoading(false);
    router.replace("/start");
  };

  return (
    <View className="flex-1">
      <View className="flex-1 gap-8">
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <Avatar name={user.name} source={user.avatar} size={40} />
            <View className="">
              <View className="flex flex-row items-center gap-2">
                <Text className={`font-poppins-semibold text-gray-800`}>
                  {user.name}
                </Text>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={16}
                  color={user.idVerified ? "#16a34a" : "#cbd5e1"}
                />
              </View>
              <Text className={`font-dm-sans text-gray-600 text-sm`}>
                {user.title}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 gap-5">
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              className="w-full flex flex-row items-center justify-between py-2"
              onPress={() => {
                router.push({
                  pathname: item.href as any,
                  params: item.params,
                });
                onClose();
              }}
            >
              <View className="flex flex-row items-center gap-2">
                {item.icon}
                <Text className={`text-gray-700 font-poppins`}>
                  {item.label}
                </Text>
                {item.badge && (
                  <Text
                    className={`rounded-full bg-gray-200 text-gray-700 font-poppins-medium text-xs px-2 py-1`}
                  >
                    {item.badge}
                  </Text>
                )}
              </View>

              <Feather name="arrow-up-right" size={20} color="#374151" />
            </TouchableOpacity>
          ))}

          {/* <View className="w-full flex flex-row items-center justify-between py-2">
            <View className="flex flex-row items-center gap-2">
              <FontAwesome
                name={`${theme === "light" ? "moon" : "sun"}-o`}
                size={20}
                color={theme === "light" ? "#374151" : "#d1d5db"}
              />
              <Text
                className={`${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                } font-poppins`}
              >
                Dark mode
              </Text>
            </View>

            <Switch
              value={theme !== "light"}
              style={{ padding: 0, margin: 0 }}
              onChange={() => toggleTheme(theme === "light" ? "dark" : "light")}
            />
          </View> */}
        </View>
      </View>

      <View className="w-full gap-2 mb-[93px]">
        <TouchableOpacity activeOpacity={0.8} className="w-full py-2">
          <View className="flex flex-row items-center gap-2">
            <FontAwesome name="trash-o" size={24} color="#ef4444" />
            <Text className="text-red-500 font-poppins">Delete Account</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full py-2"
          onPress={handleSignOut}
        >
          <View className="flex flex-row items-center gap-2">
            {!signOutLoading ? (
              <AntDesign name="poweroff" size={20} color="#ef4444" />
            ) : (
              <ActivityIndicator size={24} color="#ef4444" />
            )}
            <Text className="text-red-500 font-poppins">Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ProfileDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <Drawer
      header={<Header onClose={onClose} />}
      isOpen={isOpen}
      onClose={onClose}
    >
      {!user ? <EmptyUserData /> : <Profile user={user} onClose={onClose} />}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 44,
  },
});

export default ProfileDrawer;
