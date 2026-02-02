import { SubscriptionContainer } from "@/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

const introTexts = [
  "Unlimited access to all features",
  "Created events without KYC verification",
  "Priority custom support",
];

const subscriptions = [
  {
    month: 0,
    price: 0,
    features: ["Limited features", "Standard support"],
    isActive: true,
  },
  {
    month: 1,
    price: 12,
    features: ["All premium features", "Standard support"],
    isActive: true,
  },
  {
    month: 3,
    price: 30,
    features: ["All premium features", "Priority support"],
    isActive: true,
  },
  {
    month: 6,
    price: 54,
    features: ["All premium features", "Exclusive Content", "Priority support"],
    isActive: true,
  },
  {
    month: 12,
    price: 95,
    features: [
      "Limited features",
      "Exclusive Content",
      "Priority support",
      "Yearly bonus",
    ],
    isActive: true,
  },
];

const SubscriptionScreen = () => {
  return (
    <SubscriptionContainer>
      <View>
        <Text className="font-poppins-semibold text-xl text-gray-800">
          Manage Subscription
        </Text>
        <Text className="font-dm-sans-medium text-sm text-gray-700">
          Upgrade to premium to access all features
        </Text>
      </View>

      <View className="w-full gap-2 px-3 py-1 border-l-2 border-white">
        {introTexts.map((text, index) => (
          <View
            key={index}
            className="w-full flex flex-row items-start gap-1.5"
          >
            <MaskedView
              style={{ width: 18, height: 18 }}
              maskElement={
                <MaterialCommunityIcons
                  name="checkbox-marked-circle-outline"
                  size={18}
                />
              }
            >
              <LinearGradient
                colors={["#C427E0", "#844AFF", "#12A9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
              />
            </MaskedView>

            <Text className="font-dm-sans text-sm text-gray-700">{text}</Text>
          </View>
        ))}
      </View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-poppins-medium text-gray-700">Select plan</Text>
      </View>

      <View className="flex-1"></View>
    </SubscriptionContainer>
  );
};

export default SubscriptionScreen;
