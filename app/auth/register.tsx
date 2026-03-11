import { setAuthToken } from "@/api/client";
import {
  appleRegister,
  emailRegister,
  googleRegister,
  resendOtp,
  verifyOtp,
} from "@/api/services/auth";
import { Button, Input, NormalModal, PasswordInput } from "@/components/common";
import { AuthScreenContainer } from "@/components/organisms";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@/config/env";
import { Feather } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [invalidFirstName, setInvalidFirstName] = useState<boolean>(false);
  const [invalidLastName, setInvalidLastName] = useState<boolean>(false);
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const [invalidConfirmPassword, setInvalidConfirmPassword] =
    useState<boolean>(false);
  const [invalidPasswordTxt, setInvalidPasswordTxt] = useState<
    string | undefined
  >(undefined);
  const [isOtpOpen, setIsOtpOpen] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpTime, setOtpTime] = useState<number>(180);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [appleLoading, setAppleLoading] = useState<boolean>(false);

  const router = useRouter();
  const { setAuthUser } = useAuth();
  const toast = useToast();

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ["profile", "email"],
    offlineAccess: true,
    forceCodeForRefreshToken: false,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (!isOtpOpen) return;

    const timer = setInterval(() => {
      setOtpTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOtpOpen]);

  const getPasswordError = (password: string): string => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter (A–Z).";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must include at least one lowercase letter (a–z).";
    }
    if (!/\d/.test(password)) {
      return "Password must include at least one number (0–9).";
    }
    if (!/[@!#$%]/.test(password)) {
      return "Password must include one special character (@!#$%).";
    }

    return ""; // valid
  };

  const validate = () => {
    const isValidFirstName = firstName.trim().length > 0;
    const isValidLastName = lastName.trim().length > 0;
    const trimmed = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    const passwordError = getPasswordError(password);
    const isValidPassword = passwordError === "";
    const isValidConfirmPassword = password === confirmedPassword;

    setInvalidFirstName(!isValidFirstName);
    setInvalidLastName(!isValidLastName);
    setInvalidEmail(!isValidEmail);
    setInvalidPassword(!isValidPassword);
    setInvalidConfirmPassword(!isValidConfirmPassword);
    setInvalidPasswordTxt(passwordError);

    return (
      isValidFirstName &&
      isValidLastName &&
      isValidEmail &&
      isValidPassword &&
      isValidConfirmPassword
    );
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();

      const payload = await GoogleSignin.signIn();

      const { user: googleUser } = payload.data ?? {};

      if (!googleUser?.email || !googleUser?.id || !googleUser?.name) {
        setGoogleLoading(false);
        return Alert.alert("Google sign in error");
      }

      const response = await googleRegister(
        googleUser.givenName || "",
        googleUser.familyName || googleUser.name,
        googleUser.email,
        googleUser.id,
        googleUser.photo ?? "",
      );

      const { token, user } = response.data;
      await setAuthToken(token);
      setAuthUser(user);

      toast.success("Welcome !!!");
      router.replace("/auth/onboarding/step1");
    } catch (error: any) {
      const message = error?.message || error?.response?.data?.message;

      toast.error(message);
      if (error?.status === 400) {
        router.replace("/auth/login");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleRegister = async () => {
    setAppleLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { fullName, email, user: appleId } = credential;

      const firstName = fullName?.givenName || "";
      const lastName = fullName?.familyName || "";

      if (!appleId) {
        toast.error("Apple register failed");
        return setAppleLoading(false);
      }

      const res = await appleRegister({ firstName, lastName, email, appleId });

      const { token, user } = res.data;
      await setAuthToken(token);
      setAuthUser(user);

      toast.success("Welcome !!!");
      router.replace("/auth/onboarding/step1");
    } catch (error: any) {
      const message = error?.message || error?.response?.data?.message;
      toast.error(message);
    } finally {
      setAppleLoading(false);
    }
  };

  const handleEmailRegister = async () => {
    if (!validate()) return;

    try {
      setInvalidPassword(false);
      setEmailLoading(true);

      const response = await emailRegister(
        firstName,
        lastName,
        firstName + " " + lastName,
        email,
        password,
      );

      const { token, user } = response.data;
      await setAuthToken(token);
      setAuthUser(user);

      setIsOtpOpen(true);
    } catch (error: any) {
      const message = error?.response?.data?.message;

      toast.error(message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (email.trim().length === 0 || otp.trim().length === 0)
      return toast.warn("Email or Verification code is incorrect");

    try {
      setOtpLoading(true);

      const res = await verifyOtp({ email, code: otp });

      if (!res.ok) {
        toast.error(res.message);
      } else {
        setAuthUser(res.data);
        setIsOtpOpen(false);
        toast.success("Welcome !!!");
        router.replace("/auth/onboarding/step1");
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpTime > 0) {
      return toast.warn("Please wait before requesting another code");
    }

    if (email.trim().length === 0) {
      return toast.warn("Email is required");
    }

    try {
      setResendLoading(true);

      await resendOtp(email);

      setOtpTime(180);

      toast.success("Verification code resent");
    } catch (error) {
      toast.error("Failed to resend verification code");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <AuthScreenContainer
      title="Join the Perfect Event, Party"
      subtitle="Create your account to get started"
    >
      <View className="w-full gap-5">
        <Input
          type="string"
          placeholder="Enter your first name"
          icon={<Feather name="user" size={16} color="#4b5563" />}
          className="rounded-md"
          invalid={invalidFirstName}
          invalidTxt="First name is invalid"
          value={firstName}
          onChange={setFirstName}
        />
        <Input
          type="string"
          placeholder="Enter your last name"
          icon={<Feather name="user" size={16} color="#4b5563" />}
          className="rounded-md"
          invalid={invalidLastName}
          invalidTxt="Last name is invalid"
          value={lastName}
          onChange={setLastName}
        />
        <Input
          type="string"
          placeholder="Enter your email"
          icon={<Feather name="mail" size={16} color="#4b5563" />}
          className="rounded-md"
          invalid={invalidEmail}
          invalidTxt="Email is invalid"
          value={email}
          onChange={setEmail}
        />
        <PasswordInput
          placeholder="Create a password"
          invalid={invalidPassword}
          invalidTxt={invalidPasswordTxt}
          value={password}
          onChange={setPassword}
        />
        <PasswordInput
          placeholder="Confirm your password"
          isConfirm={true}
          invalid={invalidConfirmPassword}
          invalidTxt="Password does not match"
          value={confirmedPassword}
          onChange={setConfirmedPassword}
        />
        <View className="flex-row flex-wrap justify-center">
          <Text className="font-dm-sans text-sm text-gray-500">
            By signing up, you agree to our{" "}
          </Text>

          <TouchableOpacity activeOpacity={0.8}>
            <Text className="font-dm-sans text-sm text-[#15A5FF]">
              Terms of Service
            </Text>
          </TouchableOpacity>

          <Text className="font-dm-sans text-sm text-gray-500"> and </Text>

          <TouchableOpacity activeOpacity={0.8}>
            <Text className="font-dm-sans text-sm text-[#15A5FF]">
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
        <Button
          type="primary"
          label="Sign up"
          buttonClassName="h-12"
          textClassName="text-sm"
          loading={emailLoading}
          onPress={handleEmailRegister}
        />
      </View>

      <View className="w-full gap-6">
        <View className="flex flex-row items-center gap-1">
          <View className="flex-1 h-[1px] bg-gray-300"></View>
          <Text className="font-dm-sans text-sm text-gray-500">
            Or continue with
          </Text>
          <View className="flex-1 h-[1px] bg-gray-300"></View>
        </View>

        <Button
          type="social"
          socialType={Platform.OS === "ios" ? "apple" : "google"}
          label={`Sign up with ${Platform.OS === "ios" ? "Apple" : "Google"}`}
          buttonClassName="h-12"
          loading={Platform.OS === "ios" ? appleLoading : googleLoading}
          onPress={
            Platform.OS == "ios" ? handleAppleRegister : handleGoogleRegister
          }
        />

        <View className="flex flex-row items-center justify-center gap-2">
          <Text className="font-dm-sans text-gray-500 text-sm">
            Already have an account?
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.replace("/auth/login")}
          >
            <Text className="text-[#15A5FF] text-sm font-dm-sans">Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>

      <NormalModal
        title="Email Verification"
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
      >
        <View className="gap-6">
          <View className="gap-2">
            <Input
              type="string"
              label="Verification Code"
              placeholder=""
              bordered
              value={otp}
              onChange={setOtp}
            />

            <Text className="font-dm-sans-medium text-xs text-purple-600">
              Resend verification code in{" "}
              <Text className="font-poppins-semibold text-sm">
                {formatTime(otpTime)}
              </Text>{" "}
              minutes
            </Text>
          </View>

          <View className="flex flex-row items-center gap-4">
            <View className="flex-1">
              <Button
                type="gradient-soft"
                label="Resend"
                buttonClassName="h-10"
                disabled={otpTime > 0}
                loading={resendLoading}
                onPress={handleResendOtp}
              />
            </View>
            <View className="flex-1">
              <Button
                type="primary"
                label="Submit"
                buttonClassName="h-10"
                loading={otpLoading}
                onPress={handleVerifyOtp}
              />
            </View>
          </View>
        </View>
      </NormalModal>
    </AuthScreenContainer>
  );
};

export default RegisterScreen;
