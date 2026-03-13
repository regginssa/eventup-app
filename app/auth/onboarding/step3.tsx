import { fetchIdentityVerificationSession } from "@/api/services/didit";
import { Button, Modal } from "@/components/common";
import { OnboardingContainer } from "@/components/organisms";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";

const IdImage = require("@/assets/images/id_image.png");

const OnboardingStep3Screen = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { to } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const handleStart = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const response = await fetchIdentityVerificationSession({
        userId: user._id,
        appCallbackNextUrl: to || "/auth/onboarding/step4",
      });

      if (response.ok) {
        const { url } = response.data;

        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          toast.error("Can't open the verification");
        }
      }
    } catch (error: any) {
      toast.error("Start verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingContainer
      title="Identity verification"
      subtitle="We need to verify your identity to complete with regulations"
      step={3}
      onBack={() => router.back()}
      logo={
        <View className="w-[216px] h-[93.13px]">
          <Image
            source={IdImage}
            alt="Identity verification"
            contentFit="cover"
            transition={100}
            style={styles.image}
          />
        </View>
      }
    >
      <View className="w-full gap-4">
        <View className="flex flex-row items-center gap-3">
          <MaterialCommunityIcons
            name="smart-card-outline"
            size={16}
            color="#374151"
          />
          <Text className="font-dm-sans text-sm text-gray-700">
            Have your ID card or passport ready
          </Text>
        </View>
        <View className="flex flex-row items-center gap-3">
          <MaterialCommunityIcons
            name="camera-outline"
            size={16}
            color="#374151"
          />
          <Text className="font-dm-sans text-sm text-gray-700">
            Find a well-lit area for video verification
          </Text>
        </View>
        <View className="flex flex-row items-center gap-3">
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color="#374151"
          />
          <Text className="font-dm-sans text-sm text-gray-700">
            The process takes about 2-3 minutes
          </Text>
        </View>
      </View>

      {user?.idVerified ? (
        <View className="w-full gap-4">
          <View className="flex flex-row items-center gap-3">
            <Octicons name="verified" size={16} color="#22c55e" />
            <Text className="font-poppins-semibold text-sm text-green-500">
              Your ID has already been verified
            </Text>
          </View>

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
            textClassName="text-sm"
            onPress={() =>
              router.replace(to || ("/auth/onboarding/step4" as any))
            }
          />
        </View>
      ) : (
        <View className="w-full gap-2">
          <Button
            type="primary"
            label="Start"
            buttonClassName="h-12"
            loading={loading}
            onPress={handleStart}
          />
          <Button
            type="gradient-soft"
            label="Skip now"
            buttonClassName="h-12"
            onPress={() => router.replace("/auth/onboarding/step4")}
          />
        </View>
      )}

      <Modal
        title=""
        scrolled={true}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <View className="justify-center items-center flex flex-col">
          <Text className="text-center font-poppins-semibold text-gray-800 text-[22px]">
            Complete verification
          </Text>
          <Text className="font-dm-sans text-sm text-gray-700 text-center w-[80%]">
            You’ll be redirect to our verification partner to complete your
            identity verification.
          </Text>
        </View>

        <View className="w-full gap-2 mt-5">
          <Button
            type="primary"
            label="Continue to verifiction"
            buttonClassName="h-12"
            icon={
              <MaterialCommunityIcons
                name="arrow-right-thin"
                size={20}
                color="white"
              />
            }
            iconPosition="right"
            onPress={() => router.replace("/auth/onboarding/step4")}
          />
          <Button
            type="gradient-soft"
            label="Cancel"
            buttonClassName="h-12"
            onPress={() => setIsOpen(false)}
          />
        </View>
      </Modal>
    </OnboardingContainer>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: "100%",
  },
});

export default OnboardingStep3Screen;
