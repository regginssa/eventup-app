import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const bgLightImage = require("@/assets/images/footer.png");
const bgDarkImage = require("@/assets/images/footer_dark.png");

const Footer = () => {
  const router = useRouter();

  const navs = [
    {
      label: "Home",
      icon: (
        <MaterialIcons
          name="home-filled"
          size={24}
          color="#1f2937"
        />
      ),
      href: "/home",
    },
    {
      label: "Events",
      icon: (
        <MaterialIcons
          name="event-note"
          size={24}
          color="#1f2937"
        />
      ),
      href: "/event/mine",
    },
    {
      icon: (
        <AntDesign
          name="plus"
          size={24}
          color="#1f2937"
        />
      ),
    },
    {
      label: "Tickets",
      icon: (
        <MaterialCommunityIcons
          name="cart-plus"
          size={24}
          color="#1f2937"
        />
      ),
      href: "/tickets",
    },
    {
      label: "Shop",
      icon: (
        <MaterialIcons
          name="shopping-bag"
          size={24}
          color="#1f2937"
        />
      ),
      href: "/subscription",
    },
  ];

  return (
    <View className="w-full absolute bottom-0 h-[93px]">
      <Image
        source={bgLightImage}
        alt="bg"
        style={styles.image}
      />

      <View className="absolute inset-0 flex flex-row items-center justify-between px-8">
        {navs.map((nav, index) =>
          index === 2 ? (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              className={`flex flex-col items-center justify-center mb-28 bg-white rounded-full w-16 h-16`}
              style={styles.plus}
              onPress={() => router.push("/event/create/step1")}
            >
              <MaskedView
                style={{ width: 24, height: 24 }}
                maskElement={nav.icon}
              >
                <LinearGradient
                  colors={["#C427E0", "#844AFF", "#12A9FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                />
              </MaskedView>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              className="flex flex-col items-center justify-center"
              onPress={
                nav?.href ? () => router.push(nav.href as any) : undefined
              }
            >
              {nav.icon}
              <Text
                className={`font-poppins text-sm text-gray-800`}
              >
                {nav.label}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  plus: {
    elevation: 8,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});

export default Footer;
