import userServices from "@/api/services/user";
import {
  Button,
  CountryPicker,
  DateTimePicker,
  Modal,
  PhoneInput,
  Spinner,
} from "@/components/common";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useSubscription } from "@/components/providers/SubscriptionProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Country } from "@/types/location.types";
import { IUser } from "@/types/user";
import df from "@/utils/date";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import parsePhoneNumberFromString from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FlagButton } from "react-native-country-picker-modal";

const VerifiedBadge = require("@/assets/images/icons/verified_badge.png");

const ProfileScreen = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [birthday, setBirthday] = useState<Date>(new Date());
  const [phone, setPhone] = useState<string>("");
  const [country, setCountry] = useState<Country | null>(null);
  const [editLoading, setEditLoading] = useState<boolean>(false);

  const { id: userId } = useLocalSearchParams();
  const { user: authUser, setAuthUser } = useAuth();
  const { conversations, createConversation } = useConversation();
  const { subscriptions } = useSubscription();
  const router = useRouter();
  const toast = useToast();

  const isMe = user?._id === authUser?._id;

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await userServices.get(userId as string);
        if (!response.data) setIsNotFound(true);
        else {
          setUser(response.data);
          setBirthday(new Date(response.data.birthday));
          setPhone(user?.phone || "");
        }
      } catch (e) {
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [userId]);

  const handleMessage = async () => {
    if (!user?._id || !authUser?._id) return;

    const sub = subscriptions.find((sub) => sub._id === user.subscription.id);
    if (sub && sub.month === 0) {
      return toast.info(
        "You must subscribe your membership to write direct message",
      );
    }

    try {
      setMessageLoading(true);
      const conversation = conversations.find(
        (c) =>
          c.type === "dm" && c.participants.some((p) => p._id === user._id),
      );

      if (!conversation) {
        const newConv = await createConversation("dm", {
          user1Id: authUser._id,
          user2Id: user._id,
        });
        router.push({
          pathname: "/conversation/chat/dm",
          params: { conversationId: newConv._id },
        });
      } else {
        router.push({
          pathname: "/conversation/chat/dm",
          params: { conversationId: conversation._id },
        });
      }
    } catch (error) {
      toast.error("Could not start conversation");
    } finally {
      setMessageLoading(false);
    }
  };

  const validate = () => {
    const phoneNumber = parsePhoneNumberFromString(
      phone,
      (country?.cca2 as any) || "US",
    );

    if (!phoneNumber || !phoneNumber.isValid()) {
      toast.error("Invalid phone number");
      return false;
    }

    return true;
  };

  const handleEdit = async () => {
    if (!user?._id) return;
    if (!validate()) return;

    try {
      setEditLoading(true);
      const res = await userServices.update(user?._id as string, {
        ...user,
        birthday: df.toISOString(birthday),
        phone: `+${country?.callingCode[0]}${phone}`,
      });

      setAuthUser(res.data);
      setIsEditOpen(false);
      toast.success("Saved");
    } catch (error) {
      toast.error("Edition failed");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading)
    return (
      <SimpleContainer title="Profile">
        <Spinner size="md" />
      </SimpleContainer>
    );

  if (isNotFound || !user) {
    return (
      <SimpleContainer title="Profile">
        <View className="flex-1 items-center justify-center p-10">
          <MaterialCommunityIcons
            name="account-search-outline"
            size={64}
            color="#cbd5e1"
          />
          <Text className="text-slate-500 font-poppins-semibold mt-4">
            User not found
          </Text>
        </View>
      </SimpleContainer>
    );
  }

  const membershipStarted = user.subscription?.startedAt
    ? new Date(user.subscription.startedAt)
    : null;

  const membershipMonths = membershipStarted
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - membershipStarted.getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        ),
      )
    : 0;

  return (
    <SimpleContainer title={user.name} scrolled>
      <View className="flex-1 px-4 pb-10">
        {/* --- HEADER SECTION --- */}
        <View className="items-center mb-6">
          <View className="relative">
            <View className="p-1 rounded-full border-2 border-purple-500/20">
              <Image
                source={user.avatar}
                style={{ width: 120, height: 120, borderRadius: 60 }}
                contentFit="cover"
              />
            </View>
            <View className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-sm">
              <View
                className={`w-3 h-3 rounded-full ${user.status === "online" ? "bg-emerald-500" : "bg-slate-300"}`}
              />
            </View>
          </View>

          <View className="flex-row items-center mt-4 gap-2">
            <Text className="text-2xl font-poppins-bold text-slate-800">
              {user.name}
            </Text>
            {user.idVerified && (
              <Image source={VerifiedBadge} style={{ width: 20, height: 20 }} />
            )}
          </View>

          <View className="flex-row items-center opacity-60">
            <Ionicons name="location-sharp" size={14} color="#64748b" />
            <Text className="text-slate-500 font-dm-sans-medium text-sm ml-1">
              {user.location?.city?.name}
            </Text>
            <FlagButton
              countryCode={user.location?.country?.code as any}
              withEmoji
              containerButtonStyle={{ marginLeft: 4 }}
              placeholder=""
            />
          </View>
        </View>

        {/* --- ACTION BUTTONS --- */}
        <View className="flex-row gap-3 mb-8">
          {isMe ? (
            <Button
              type="primary"
              label="Edit Profile"
              onPress={() => setIsEditOpen(true)}
              buttonClassName="flex-1 h-12 rounded-2xl bg-slate-900"
              icon={<Feather name="edit-3" size={18} color="white" />}
            />
          ) : (
            <>
              <Button
                type="primary"
                label={messageLoading ? "" : "Message"}
                onPress={handleMessage}
                buttonClassName="flex-1 h-12 rounded-2xl bg-purple-600 shadow-lg shadow-purple-200"
                icon={
                  !messageLoading && (
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={18}
                      color="white"
                    />
                  )
                }
                loading={messageLoading}
              />
              <TouchableOpacity className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center">
                <Feather name="share-2" size={20} color="#64748b" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* --- STATS GRID --- */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-[24px] items-center">
            <Text className="text-purple-600 font-poppins-bold text-lg">
              {user.tickets?.length || 0}
            </Text>
            <Text className="text-slate-400 font-dm-sans-bold text-[10px] uppercase tracking-wider">
              Tickets
            </Text>
          </View>
          <View className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-[24px] items-center">
            <Text className="text-slate-800 font-poppins-bold text-lg">
              {user.rate || 0}
            </Text>
            <Text className="text-slate-400 font-dm-sans-bold text-[10px] uppercase tracking-wider">
              Rating
            </Text>
          </View>
          <View className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-[24px] items-center">
            <Text className="text-slate-800 font-poppins-bold text-lg">
              {user.accountType === "individual" ? "Pro" : "Host"}
            </Text>
            <Text className="text-slate-400 font-dm-sans-bold text-[10px] uppercase tracking-wider">
              Tier
            </Text>
          </View>
        </View>

        {/* --- INFO CARD --- */}
        <View className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden mb-6">
          <LinearGradient
            colors={["rgba(132, 74, 255, 0.05)", "transparent"]}
            className="p-6"
          >
            <Text className="text-slate-400 font-poppins-bold text-[10px] uppercase tracking-[2px] mb-3">
              About & Bio
            </Text>
            <Text className="text-slate-800 font-poppins-semibold text-base mb-1">
              {user.title || "Experience Enthusiast"}
            </Text>
            <Text className="text-slate-500 font-dm-sans text-sm leading-6">
              {user.description || "No bio provided yet."}
            </Text>
          </LinearGradient>
        </View>

        {isMe && (
          <View className="w-full mb-6">
            {/* Upper */}
            <View className="bg-white rounded-t-[24px] border-t border-l border-r border-slate-200 p-6">
              <Text className="text-slate-400 font-poppins-bold text-[10px] uppercase tracking-[2px] mb-4">
                Account Information
              </Text>

              <View className="gap-4">
                {/* Email */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
                      <Feather name="mail" size={16} color="#64748b" />
                    </View>
                    <Text className="text-slate-700 font-dm-sans-medium">
                      {user.email}
                    </Text>
                  </View>

                  {user.emailVerified && (
                    <View className="flex-row items-center gap-1">
                      <Feather name="check-circle" size={14} color="#10b981" />
                      <Text className="text-emerald-600 text-xs font-dm-sans-bold">
                        VERIFIED
                      </Text>
                    </View>
                  )}
                </View>

                {/* Phone */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
                      <Feather name="phone" size={16} color="#64748b" />
                    </View>
                    <Text className="text-slate-700 font-dm-sans-medium">
                      {user.phone || "No phone added"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View className="flex-row items-center justify-between bg-white">
              <View className="w-5 h-10 rounded-r-full bg-slate-50 border-r border-t border-b border-slate-200 -ml-[1px]" />
              <View className="flex-1 h-[1px] border-b border-dashed border-slate-300 mx-2" />
              <View className="w-5 h-10 rounded-l-full bg-slate-50 border-l border-t border-b border-slate-200 -mr-[1px]" />
            </View>

            {/* Membership */}
            <View className="bg-white rounded-b-[24px] border-b border-l border-r border-slate-200 p-6 pt-2">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-slate-400 font-dm-sans-bold text-[10px] uppercase tracking-widest mb-1">
                    Membership Since
                  </Text>
                  <Text className="font-poppins-bold text-slate-800 text-lg">
                    {membershipStarted
                      ? membershipStarted.toLocaleDateString()
                      : "Free User"}
                  </Text>
                </View>

                <View className="bg-purple-100 px-3 py-1.5 rounded-xl flex-row items-center gap-1">
                  <MaterialCommunityIcons
                    name="crown"
                    size={14}
                    color="#844AFF"
                  />
                  <Text className="text-[10px] font-poppins-bold text-purple-600 uppercase">
                    {user.accountType}
                  </Text>
                </View>
              </View>

              {membershipStarted && (
                <View className="flex-row items-center justify-between">
                  <Text className="text-slate-500 font-dm-sans-medium">
                    Active Membership
                  </Text>

                  <Text className="font-poppins-semibold text-slate-800">
                    {membershipMonths} month{membershipMonths > 1 ? "s" : ""}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* --- VERIFICATION TICKET --- */}
        <View className="w-full">
          {/* Upper Part */}
          <View className="bg-slate-50 rounded-t-[24px] border-t border-l border-r border-slate-200 p-6">
            <Text className="text-slate-400 font-poppins-bold text-[10px] uppercase tracking-[2px] mb-4">
              Trust & Safety
            </Text>
            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center">
                    <Feather name="check" size={16} color="#10b981" />
                  </View>
                  <Text className="text-slate-700 font-dm-sans-medium">
                    Email Verified
                  </Text>
                </View>
                <Text className="text-emerald-600 font-dm-sans-bold text-xs">
                  ACTIVE
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View
                    className={`w-8 h-8 rounded-full ${user.idVerified ? "bg-emerald-100" : "bg-amber-100"} items-center justify-center`}
                  >
                    <Feather
                      name={user.idVerified ? "shield" : "alert-circle"}
                      size={16}
                      color={user.idVerified ? "#10b981" : "#f59e0b"}
                    />
                  </View>
                  <Text className="text-slate-700 font-dm-sans-medium">
                    Identity Status
                  </Text>
                </View>
                <Text
                  className={`${user.idVerified ? "text-emerald-600" : "text-amber-600"} font-dm-sans-bold text-xs uppercase`}
                >
                  {user.idVerified ? "Verified" : "Pending"}
                </Text>
              </View>
            </View>
          </View>

          {/* Punched Hole Divider */}
          <View className="flex-row items-center justify-between bg-slate-50">
            <View className="w-5 h-10 rounded-r-full bg-white border-r border-t border-b border-slate-200 -ml-[1px]" />
            <View className="flex-1 h-[1px] border-b border-dashed border-slate-300 mx-2" />
            <View className="w-5 h-10 rounded-l-full bg-white border-l border-t border-b border-slate-200 -mr-[1px]" />
          </View>

          {/* Lower Part */}
          <View className="bg-slate-50 rounded-b-[24px] border-b border-l border-r border-slate-200 p-6 pt-2">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-slate-400 font-dm-sans-bold text-[10px] uppercase tracking-widest mb-1">
                  Member Since
                </Text>
                <Text className="font-poppins-bold text-slate-800 text-lg">
                  {new Date().getFullYear()}
                </Text>
              </View>
              <View className="bg-purple-100 px-3 py-1.5 rounded-xl flex-row items-center gap-1">
                <MaterialCommunityIcons
                  name="crown"
                  size={14}
                  color="#844AFF"
                />
                <Text className="text-[10px] font-poppins-bold text-purple-600 uppercase">
                  {user.accountType}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Modal
        title="Edit Profile"
        scrolled
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <View className="gap-4">
          <DateTimePicker
            label="Birthday"
            bordered
            value={new Date(user.birthday) || birthday}
            onPick={setBirthday}
          />
          <CountryPicker
            label="Country"
            placeholder="Select your country"
            invalidText="Invalid country"
            bordered
            value={country}
            onPick={setCountry}
          />
          <PhoneInput
            label="Phone number"
            placeholder="Select your country first"
            countryCode={user.location.country?.code}
            bordered
            value={phone}
            onChange={setPhone}
          />
          <Button
            type="gradient-glass"
            label="Save Changes"
            loading={editLoading}
            onPress={handleEdit}
          />
        </View>
      </Modal>
    </SimpleContainer>
  );
};

export default ProfileScreen;
