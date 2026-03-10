import { setAuthToken } from "@/api/client";
import { emailRegister, googleRegister } from "@/api/services/auth";
import { Button, Input, PasswordInput } from "@/components/common";
import { AuthScreenContainer } from "@/components/organisms";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@/config/env";
import { Feather } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

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

      toast.success("Welcome !!!");
      router.replace("/auth/onboarding/step1");
    } catch (error: any) {
      const message = error?.response?.data?.message;

      toast.error(message);
    } finally {
      setEmailLoading(false);
    }
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
          socialType="google"
          label="Sign up with Google"
          buttonClassName="h-12"
          loading={googleLoading}
          onPress={handleGoogleRegister}
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
    </AuthScreenContainer>
  );
};

export default RegisterScreen;
