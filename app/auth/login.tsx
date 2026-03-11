import { setAuthToken } from "@/api/client";
import {
  appleLogin,
  emailLogin,
  googleLogin,
  resendOtp,
  verifyOtp,
} from "@/api/services/auth";
import {
  Button,
  Checkbox,
  Input,
  NormalModal,
  PasswordInput,
} from "@/components/common";
import { AuthScreenContainer } from "@/components/organisms";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@/config/env";
import { useRedirect } from "@/hooks";
import { Feather } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRemembered, setIsRemembered] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const [isOtpOpen, setIsOtpOpen] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpTime, setOtpTime] = useState<number>(180);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [appleLoading, setAppleLoading] = useState<boolean>(false);

  const { redirect } = useRedirect();
  const { setAuthUser } = useAuth();
  const toast = useToast();

  const router = useRouter();

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ["profile", "email"],
    offlineAccess: true,
    forceCodeForRefreshToken: false,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
  });

  const validate = () => {
    const trimmed = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const isValidPassword = password.length > 0;

    setInvalidEmail(!isValidEmail);
    setInvalidPassword(!isValidPassword);

    return isValidEmail && isValidPassword;
  };

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

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();

      const payload = await GoogleSignin.signIn();

      const { user: googleUser } = payload.data ?? {};

      if (!googleUser?.email || !googleUser?.id) {
        setGoogleLoading(false);
        return toast.error("Google sign in error");
      }

      const response = await googleLogin(googleUser.email, googleUser.id);

      const { token, user } = response.data;
      await setAuthToken(token);
      setAuthUser(user);
      toast.success("Welcome back!!!");

      redirect(user);
    } catch (error: any) {
      const message = error?.message || error?.response?.data?.message;

      toast.error(message);
      if (error?.status === 404) {
        router.replace("/auth/register");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setAppleLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync();

      const { user: appleId, email, fullName } = credential;

      if (!appleId) {
        toast.error("Apple log in failed");
        return setAppleLoading(false);
      }

      const res = await appleLogin({ appleId, email });
      const { token, user } = res.data;
      await setAuthToken(token);
      setAuthUser(user);
      toast.success("Welcome back!!!");

      redirect(user);
    } catch (error: any) {
      toast.error(error?.message || "Apple log in failed");
    } finally {
      setAppleLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!validate()) return;

    try {
      setInvalidPassword(false);
      setEmailLoading(true);

      const response = await emailLogin(email, password);

      const { token, user } = response.data;
      await setAuthToken(token);
      setAuthUser(user);

      if (user.emailVerified) {
        toast.success("Welcome back!!!");
        redirect(user);
      } else {
        setIsOtpOpen(true);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;

      toast.error(error?.message || message || "An error occurred");

      if (error?.status === 401) {
        setInvalidPassword(true);
      }
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
        toast.success("Welcome back!!!");
        redirect(res.data);
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
      title="Welcome back!"
      subtitle="Sign in to join the party"
    >
      <View className="w-full gap-5">
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
          placeholder="Enter your password"
          invalid={invalidPassword}
          invalidTxt="Password is incorrect"
          value={password}
          onChange={setPassword}
        />

        <View className="w-full flex flex-row items-center justify-between">
          <Checkbox
            label="Remember me"
            isChecked={isRemembered}
            onCheck={setIsRemembered}
          />

          <TouchableOpacity activeOpacity={0.8}>
            <Text className="text-[#15A5FF] font-dm-sans text-sm">
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          type="primary"
          label="Sign in"
          buttonClassName="h-12"
          textClassName="text-sm"
          loading={emailLoading}
          onPress={handleEmailLogin}
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
          label={`Sign in with ${Platform.OS === "ios" ? "Apple" : "Google"}`}
          buttonClassName="h-12"
          loading={Platform.OS === "ios" ? appleLoading : googleLoading}
          onPress={Platform.OS == "ios" ? handleAppleLogin : handleGoogleLogin}
        />

        <View className="flex flex-row items-center justify-center gap-2">
          <Text className="font-dm-sans text-gray-500 text-sm">
            Don’t have an account?
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.replace("/auth/register")}
          >
            <Text className="text-[#15A5FF] text-sm font-dm-sans">Sign Up</Text>
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

export default LoginScreen;
