import { fetchUser } from "@/api/scripts/user";
import { Button } from "@/components/common";
import { setAuthUser } from "@/redux/slices/auth.slice";
import { RootState } from "@/redux/store";
import { TKycStatus } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const DiditScreen = () => {
  const [kycStatus, setKycStatus] = useState<TKycStatus>("In Progress");
  const lottieRef = useRef<LottieView>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { status } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleGoBack = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const response = await fetchUser(user._id);

      if (response.ok) {
        dispatch(setAuthUser(response.data));

        if (kycStatus === "Approved") {
          router.replace("/onboarding/step4");
        } else {
          router.replace("/onboarding/step3");
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("callback kyc status: ", status);
    if (status) {
      setKycStatus(status as any);
    }
  }, [status]);

  return (
    <SafeAreaView className="flex-1 bg-[#EEF0FC] flex-col items-center justify-center p-5">
      <StatusBar style="dark" />
      {kycStatus === "Approved" ? (
        <LottieView
          ref={lottieRef}
          source={require("@/assets/animations/id_scan_success.json")}
          autoPlay
          loop={false}
          style={styles.success}
        />
      ) : kycStatus === "Declined" ||
        kycStatus === "Expired" ||
        kycStatus === "Abandoned" ? (
        <LottieView
          ref={lottieRef}
          source={require("@/assets/animations/error.json")}
          autoPlay
          style={styles.error}
        />
      ) : (
        <LottieView
          ref={lottieRef}
          source={require("@/assets/animations/pending.json")}
          autoPlay
          loop={false}
          style={styles.pending}
        />
      )}

      <View className="w-full gap-2">
        <Text className="font-poppins-semibold text-lg text-gray-800 text-center">
          Identity verification{" "}
          {kycStatus === "Declined" || kycStatus === "Expired"
            ? "failed"
            : kycStatus === "Approved"
            ? "successful"
            : "is in progress"}
        </Text>
        <Text className="font-dm-sans-medium text-gray-600 text-center">
          {kycStatus === "Declined" || kycStatus === "Expired"
            ? "We were unable to verify your identity at this time. Please retry later."
            : kycStatus === "Approved"
            ? "Your identity has been successfully verified. You can now access all features and continue with confidence."
            : "Your identity verification is currently being reviewed. This process may take a few minutes. We'll notify you once it's complete."}
        </Text>
        <Button
          type="primary"
          label="Go back"
          icon={
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={20}
              color="white"
            />
          }
          iconPosition="left"
          buttonClassName="h-12 mt-10"
          loading={loading}
          onPress={handleGoBack}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  success: {
    width: 250,
    height: 250,
  },
  error: {
    width: 200,
    height: 200,
  },
  pending: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
});

export default DiditScreen;
