import { uploadFile } from "@/api/services/upload";
import { updateUser } from "@/api/services/user";
import { Avatar, Button, Input, Textarea } from "@/components/common";
import { TAvatar } from "@/components/common/Avatar";
import { OnboardingContainer } from "@/components/organisms";

import { useAuth } from "@/components/providers/AuthProvider";
import { IUser } from "@/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

const OnboardingStep2Screen = () => {
  const [avatar, setAvatar] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<TAvatar | null>(null);
  const [title, setTitle] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [invalidTitle, setInvalidTitle] = useState<boolean>(false);
  const [invalidAbout, setInvalidAbout] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { user, setAuthUser } = useAuth();

  const validate = () => {
    setInvalidTitle(title.trim().length === 0 || title.trim().length > 20);
    setInvalidAbout(about.trim().length === 0 || about.trim().length > 500);

    return !(
      title.trim().length === 0 ||
      title.trim().length > 20 ||
      about.trim().length === 0 ||
      about.trim().length > 500
    );
  };

  const handleSubmit = async () => {
    if (!validate() || !user?._id) return;

    try {
      setLoading(true);

      let avatarUri = avatar;

      if (avatarFile) {
        const fileUri = avatarFile?.uri; // keep the "file://" prefix on iOS
        const fileName = avatarFile?.name || `photo_${Date.now()}.jpg`;
        const mimeType = avatarFile?.mimeType || "image/jpeg"; // don't use "image"

        const formData = new FormData();
        formData.append("file", {
          uri: fileUri,
          name: fileName,
          type: mimeType,
        } as any);

        const response = await uploadFile(formData);

        if (response.ok && response.data) {
          avatarUri = response.data;
        }
      }

      const updates: IUser = {
        ...user,
        avatar: avatarUri,
        title,
        description: about,
      };

      const response = await updateUser(user._id, updates);

      if (response.ok) {
        setAuthUser(response.data);

        router.replace("/auth/onboarding/step3");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    setAvatar(user.avatar ?? "");
    setTitle(user.title ?? "");
    setAbout(user.description ?? "");
  }, [user]);

  return (
    <OnboardingContainer
      title="Professional profile"
      subtitle="Tell us about your expertise"
      step={2}
      onBack={() => router.back()}
    >
      <View className="flex items-center justify-center">
        <Avatar
          name={user?.name as string}
          source={avatar}
          onChange={(file: TAvatar) => {
            setAvatarFile(file);
            setAvatar(file.uri);
          }}
        />
      </View>
      <Input
        type="string"
        label="Professional title"
        placeholder="e.g. Designer, Teacher"
        icon={
          <MaterialCommunityIcons
            name="bag-personal-outline"
            size={16}
            color="#4b5563"
          />
        }
        invalid={invalidTitle}
        invalidTxt="Text must be under 20 characters"
        className="rounded-md"
        value={title}
        onChange={setTitle}
      />

      <Textarea
        label="About you"
        placeholder="Describe your expertise, experience, and what you’re passionate about.."
        invalid={invalidAbout}
        invalidText="Text must be under 500 characters"
        value={about}
        onChange={setAbout}
      />

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
        loading={loading}
        onPress={handleSubmit}
      />
    </OnboardingContainer>
  );
};

export default OnboardingStep2Screen;
