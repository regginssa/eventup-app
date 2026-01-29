import { setAuthToken } from "@/src/api/client";
import { emailLogin, googleLogin } from "@/src/api/services/auth";
import {
  Button,
  Checkbox,
  Input,
  PasswordInput,
} from "@/src/components/common";
import { AuthScreenContainer } from "@/src/components/organisms";
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@/src/config/env";
import useRedirect from "@/src/hooks/useRedirect";
import { setAuth } from "@/src/store/slices/auth.slice";
import { Feather } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRemembered, setIsRemembered] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { redirect } = useRedirect();

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

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();

      const payload = await GoogleSignin.signIn();

      const { user: googleUser } = payload.data ?? {};

      if (!googleUser?.email || !googleUser?.id) {
        setGoogleLoading(false);
        return Alert.alert("Google sign in error");
      }

      const response = await googleLogin(googleUser.email, googleUser.id);

      const { token, user } = response.data;
      await setAuthToken(token);
      dispatch(setAuth({ isAuthenticated: true, user }));

      Alert.alert("Welcome back!!!");

      redirect(user);
    } catch (error: any) {
      const message = error?.response?.data?.message;

      Alert.alert(message);
      if (error?.status === 404) {
        router.replace("/auth/register");
      }
    } finally {
      setGoogleLoading(false);
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
      dispatch(setAuth({ isAuthenticated: true, user }));

      Alert.alert("Welcome back!!!");

      redirect(user);
    } catch (error: any) {
      const message = error?.response?.data?.message;

      Alert.alert(error?.message || "An error occurred");

      if (error?.status === 401) {
        setInvalidPassword(true);
      }
    } finally {
      setEmailLoading(false);
    }
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
          label="Sign in with email"
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
          socialType="google"
          label="Sign in with Google"
          buttonClassName="h-12"
          loading={googleLoading}
          onPress={handleGoogleLogin}
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
    </AuthScreenContainer>
  );
};

export default LoginScreen;
