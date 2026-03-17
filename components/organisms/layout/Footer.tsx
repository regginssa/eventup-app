import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const bgLightImage = require("@/assets/images/footer.png");

const FOOTER_HEIGHT = 93;
const HANDLE_HEIGHT = 10;

const Footer = () => {
  const router = useRouter();

  const translateY = useRef(new Animated.Value(0)).current;
  const [hidden, setHidden] = useState(false);

  const hideFooter = () => {
    if (hidden) return;

    Animated.timing(translateY, {
      toValue: FOOTER_HEIGHT - HANDLE_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setHidden(true));
  };

  const showFooter = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setHidden(false));
  };

  const navs = [
    {
      label: "Home",
      icon: <MaterialIcons name="home-filled" size={24} color="#1f2937" />,
      href: "/home",
    },
    {
      label: "Events",
      icon: <MaterialIcons name="event-note" size={24} color="#1f2937" />,
      href: "/event/mine",
    },
    {
      icon: <AntDesign name="plus" size={24} color="#1f2937" />,
    },
    {
      label: "Tickets",
      icon: (
        <MaterialCommunityIcons name="cart-plus" size={24} color="#1f2937" />
      ),
      href: "/tickets",
    },
    {
      label: "Shop",
      icon: <MaterialIcons name="shopping-bag" size={24} color="#1f2937" />,
      href: "/subscription",
    },
  ];

  return (
    <>
      {/* Outside press area */}
      {/* {!hidden && (
        <Pressable
          style={{
            position: "absolute",
            top: -1000,
            bottom: -1000,
            left: -1000,
            right: -1000,
            zIndex: 10,
          }}
          onPress={hideFooter}
        />
      )} */}

      {/* Footer */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <Image source={bgLightImage} alt="bg" style={styles.image} />

        <View className="absolute inset-0 flex flex-row items-center justify-between px-8">
          {navs.map((nav, index) =>
            index === 2 && !hidden ? (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                className="flex flex-col items-center justify-center mb-28 bg-white rounded-full w-16 h-16"
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
                <Text className="font-poppins text-sm text-gray-800">
                  {nav.label}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      </Animated.View>

      {/* Handle */}
      {/* {hidden && (
        <Pressable style={styles.handleContainer} onPress={showFooter}>
          <View style={styles.handle} />
        </Pressable>
      )} */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    height: FOOTER_HEIGHT,
    width: "100%",
  },
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
  handleContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: HANDLE_HEIGHT,
  },
  handle: {
    width: 60,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#999",
  },
});

export default Footer;
