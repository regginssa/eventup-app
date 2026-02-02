import { Button, SubscriptionContainer } from "@/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

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
    isActive: false,
  },
  {
    month: 3,
    price: 30,
    features: ["All premium features", "Priority support"],
    isActive: false,
    save: 17,
  },
  {
    month: 6,
    price: 54,
    features: ["All premium features", "Exclusive Content", "Priority support"],
    isActive: false,
    isRecommend: true,
    save: 25,
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
    isActive: false,
    save: 34,
  },
];

const SubscriptionScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(6);

  const renderItem = ({ item, selected }: { item: any; selected: boolean }) => {
    const Wrapper = ({ children }: any) =>
      selected ? (
        <LinearGradient
          colors={["#C427E0", "#844AFF", "#12A9FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 12,
            position: "relative",
            width: "100%",
            height: 150,
            overflow: "visible",
          }}
        >
          {children}
          <LinearGradient
            colors={["#C427E0", "#844AFF", "#12A9FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              position: "absolute",
              top: -14,
              left: "50%",
              marginLeft: -14,
            }}
          >
            <View className="bg-white flex flex-row inset-[1px] absolute rounded-full">
              <LinearGradient
                colors={["#C427E0", "#844AFF", "#12A9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  position: "absolute",
                  inset: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons name="check" size={18} color="white" />
              </LinearGradient>
            </View>
          </LinearGradient>
        </LinearGradient>
      ) : (
        <View
          style={{
            borderRadius: 12,
            position: "relative",
            width: "100%",
            height: 150,
          }}
        >
          {children}
        </View>
      );

    return (
      <Wrapper selected={selected}>
        <TouchableOpacity
          activeOpacity={0.8}
          className="p-5 bg-white rounded-xl flex flex-col gap-4 absolute inset-[1px]"
          onPress={() => setSelectedMonth(item.month)}
        >
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex flex-col items-start gap-1">
              <View className="flex flex-row items-center gap-2">
                <View className="flex flex-row items-end gap-1">
                  <Text className="font-poppins-semibold text-2xl text-gray-800">
                    {item.month === 0 ? "Free" : item.month}
                  </Text>
                  {item.month > 0 && (
                    <Text className="font-poppins-semibold text-lg text-gray-600">
                      Month
                    </Text>
                  )}
                </View>

                {item.isActive && (
                  <View className="flex items-center justify-center px-2 py-1 rounded-md bg-green-600">
                    <Text className="font-dm-sans-medium text-white text-xs">
                      Active
                    </Text>
                  </View>
                )}

                {item.isRecommend && (
                  <LinearGradient
                    colors={["#C427E0", "#844AFF", "#12A9FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 6 }}
                  >
                    <View className="flex items-center justify-center px-2 py-1 rounded-md">
                      <Text className="font-dm-sans-medium text-white text-xs">
                        Recommended
                      </Text>
                    </View>
                  </LinearGradient>
                )}
              </View>

              {item.save && (
                <View className="px-3 py-1 rounded-lg bg-[#EFE8FF]">
                  <Text className="font-dm-sans-medium text-[#844AFF] text-xs">
                    Save {item.save}%
                  </Text>
                </View>
              )}
            </View>

            <View className="flex flex-row items-start">
              <Text className="font-poppins-semibold text-lg text-gray-600">
                $
              </Text>
              <Text className="font-poppins-semibold text-3xl text-gray-800">
                {item.price}
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <View className="flex flex-row items-center gap-4">
              {item.features.slice(0, 2).map((feature: any, index: number) => (
                <View
                  key={index}
                  className="flex flex-row items-center gap-1.5"
                >
                  <MaterialCommunityIcons
                    name="checkbox-marked-circle-outline"
                    size={16}
                    color="#374151"
                  />
                  <Text className="font-dm-sans text-gray-700 text-sm">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            <View className="flex flex-row items-center gap-4">
              {item.features.slice(2, 4).map((feature: any, index: number) => (
                <View
                  key={index}
                  className="flex flex-row items-center gap-1.5"
                >
                  <MaterialCommunityIcons
                    name="checkbox-marked-circle-outline"
                    size={16}
                    color="#374151"
                  />
                  <Text className="font-dm-sans text-gray-700 text-sm">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Wrapper>
    );
  };

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

      <View className="flex-1 -mt-[20px]">
        <FlatList
          data={subscriptions}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) =>
            renderItem({ item, selected: selectedMonth === item.month })
          }
          contentContainerStyle={{ paddingTop: 20, gap: 24 }}
        />
      </View>

      <Button
        type="primary"
        label={`Subscribe for $${subscriptions.find((s) => s.month === selectedMonth)?.price || 0}`}
        buttonClassName="h-12"
      />
    </SubscriptionContainer>
  );
};

export default SubscriptionScreen;
