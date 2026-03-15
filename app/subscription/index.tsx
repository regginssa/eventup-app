import { Button, Spinner, SubscriptionContainer } from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSubscription } from "@/components/providers/SubscriptionProvider";
import { ISubscription } from "@/types/subscription";
import { formatDateTime } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const introTexts = [
  "Unlimited access to all features",
  "Created events without KYC verification",
  "Priority custom support",
];

export type TSubscriptionItem = {
  month: number;
  price: number;
  features: string[];
  currency: string;
  isActive: boolean;
  isRecommended: boolean;
  save?: number;
};

export const calculateSave = (
  price: number,
  month: number,
  monthlyPrice = 12,
) => {
  if (month <= 1) return 0;

  const originalPrice = month * monthlyPrice;
  const savePercent = ((originalPrice - price) / originalPrice) * 100;

  return Math.round(savePercent);
};

const SubscriptionScreen = () => {
  const [currentSubscription, setCurrentSubscription] =
    useState<ISubscription | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(true);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [oneMonthPrice, setOneMonthPrice] = useState<number>(0);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const router = useRouter();
  const { subscriptions } = useSubscription();

  useEffect(() => {
    setLoading(true);
    if (subscriptions.length === 0) {
      setOneMonthPrice(12);
    } else {
      setOneMonthPrice(subscriptions[1].price);
      setSelectedSubscriptionId(subscriptions[3]._id);

      if (!user?.subscription) {
        return setLoading(false);
      }

      const current = subscriptions.find(
        (s) => s._id === user.subscription?.id,
      );
      setCurrentSubscription(current || null);

      if (!user.subscription.startedAt || !current) {
        setIsExpired(false);
        return setLoading(false);
      }

      const start = new Date(user.subscription.startedAt);
      const expiry = new Date(start);
      expiry.setMonth(expiry.getMonth() + current.month);

      setExpiryDate(formatDateTime(expiry.toISOString()));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiryDay = new Date(expiry);
      expiryDay.setHours(0, 0, 0, 0);

      setIsExpired(today > expiryDay);
    }
    setLoading(false);
  }, [subscriptions, user]);

  const selectedSubscription = subscriptions.find(
    (s) => s._id === selectedSubscriptionId,
  );

  const isFreePlan = selectedSubscription?.month === 0;

  const isCurrentPlan = selectedSubscriptionId === currentSubscription?._id;

  const hasValidSubscription =
    currentSubscription && currentSubscription.month > 0 && !isExpired;

  const shouldDisableButton =
    isFreePlan || isCurrentPlan || hasValidSubscription;

  const renderItem = ({
    item,
    selected,
  }: {
    item: ISubscription;
    selected: boolean;
  }) => {
    const Wrapper = ({ children }: any) =>
      selected && item._id !== currentSubscription?._id ? (
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

    const savePercent = calculateSave(item.price, item.month, oneMonthPrice);

    const formattedItem: TSubscriptionItem = {
      ...item,
      isActive: user?.subscription?.id === item._id,
      isRecommended: item.month === 6,
      save: savePercent === 0 ? undefined : savePercent,
    };

    return (
      <Wrapper selected={selected}>
        <TouchableOpacity
          activeOpacity={0.8}
          className={`p-5 ${item._id !== currentSubscription?._id ? "bg-white" : "bg-gray-200"} rounded-xl flex flex-col gap-4 absolute inset-[1px]`}
          disabled={item._id === currentSubscription?._id}
          onPress={
            shouldDisableButton
              ? undefined
              : () => setSelectedSubscriptionId(item._id)
          }
        >
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex flex-col items-start gap-1">
              <View className="flex flex-row items-center gap-2">
                <View className="flex flex-row items-end gap-1">
                  <Text className="font-poppins-semibold text-2xl text-gray-800">
                    {formattedItem.month === 0 ? "Free" : formattedItem.month}
                  </Text>
                  {formattedItem.month > 0 && (
                    <Text className="font-poppins-semibold text-lg text-gray-600">
                      {formattedItem.month === 1 ? "Month" : "Months"}
                    </Text>
                  )}
                </View>

                {formattedItem.isActive && (
                  <View className="flex items-center justify-center px-2 py-1 rounded-md bg-green-600">
                    <Text className="font-dm-sans-medium text-white text-xs">
                      Active
                    </Text>
                  </View>
                )}

                {formattedItem.isRecommended && (
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

              {formattedItem.save && (
                <View className="px-3 py-1 rounded-lg bg-[#EFE8FF]">
                  <Text className="font-dm-sans-medium text-[#844AFF] text-xs">
                    Save {formattedItem.save}%
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

  const price =
    subscriptions.find((s) => s._id === selectedSubscriptionId)?.price || 0;

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

      <Text className="font-poppins-medium text-gray-700">Select plan</Text>

      <View className="flex-1 -mt-5">
        {loading ? (
          <Spinner size="md" />
        ) : (
          <FlatList
            data={subscriptions}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) =>
              renderItem({
                item,
                selected: selectedSubscriptionId === item._id,
              })
            }
            contentContainerStyle={{ paddingTop: 20, gap: 24 }}
          />
        )}
      </View>

      <Button
        type="primary"
        label={
          isCurrentPlan && hasValidSubscription
            ? `Ends on ${expiryDate}`
            : isFreePlan
              ? "Free Plan Selected"
              : `Subscribe for $${price}`
        }
        buttonClassName="h-12"
        disabled={!!shouldDisableButton}
        onPress={() =>
          router.push({
            pathname: "/subscription/checkout",
            params: {
              id: selectedSubscriptionId,
              oneMonthPrice,
            },
          })
        }
      />
    </SubscriptionContainer>
  );
};

export default SubscriptionScreen;
