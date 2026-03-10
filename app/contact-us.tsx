import SupportAPI from "@/api/services/support";
import { Button, Input, Textarea } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Text, View } from "react-native";

const ContactUs = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const { user, logout } = useAuth();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!user?.email) {
      toast.error("Authentication is expired. Please try to log in");
      await logout();
      return;
    }
    setSubmitLoading(true);

    try {
      const res = await SupportAPI.sendMessage({
        firstName,
        lastName,
        email: user.email,
        subject,
        text,
      });

      if (res.ok) {
        toast.success(
          "Submitted successfully. We will get back to you very soon",
        );
        setFirstName("");
        setLastName("");
        setSubject("");
        setText("");
      }
    } catch (error) {
      toast.error("Failed to submit");
    } finally {
      setSubmitLoading(false);
    }
  };

  const isValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    subject.trim().length > 0 &&
    text.trim().length > 0;

  return (
    <SimpleContainer title="Support Center" scrolled>
      <View className="flex-1 px-1">
        {/* --- PREMIUM HERO SECTION --- */}
        <View className="mb-6 rounded-[24px] overflow-hidden bg-white border border-slate-100 shadow-sm">
          <LinearGradient
            colors={["rgba(132, 74, 255, 0.08)", "transparent"]}
            style={{ padding: 24 }}
          >
            <View className="flex-row justify-between items-start mb-4">
              <View className="bg-purple-100 p-3 rounded-2xl">
                <Feather name="headphones" size={24} color="#844AFF" />
              </View>
              <View className="bg-emerald-100 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <Text className="text-[10px] font-poppins-bold text-emerald-600 uppercase">
                  Available 24/7
                </Text>
              </View>
            </View>

            <Text className="font-poppins-bold text-slate-800 text-2xl leading-8 mb-2">
              How can we help?
            </Text>
            <Text className="text-slate-500 font-dm-sans text-sm leading-5">
              Our dedicated premium support team is here to ensure your
              experience is seamless. Expect a response within 2 hours.
            </Text>
          </LinearGradient>
        </View>

        {/* --- SUPPORT CHANNELS --- */}
        {/* <View className="flex-row gap-3 mb-6">
          <TouchableOpacity className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl items-center">
            <Ionicons name="chatbubbles-outline" size={20} color="#64748b" />
            <Text className="text-slate-800 font-poppins-bold text-[10px] uppercase mt-2">
              Live Chat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl items-center">
            <Feather name="mail" size={20} color="#64748b" />
            <Text className="text-slate-800 font-poppins-bold text-[10px] uppercase mt-2">
              Email Us
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* --- CONTACT FORM CARD --- */}
        <View className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 mb-8">
          <Text className="text-slate-400 font-poppins-bold text-[10px] uppercase tracking-[2px] mb-5">
            Send a Message
          </Text>

          <View className="gap-y-4">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  type="string"
                  label="First Name"
                  placeholder="John"
                  bordered
                  value={firstName}
                  onChange={setFirstName}
                />
              </View>
              <View className="flex-1">
                <Input
                  type="string"
                  label="Last Name"
                  placeholder="Doe"
                  bordered
                  value={lastName}
                  onChange={setLastName}
                />
              </View>
            </View>

            <Input
              type="string"
              label="Subject"
              placeholder="What is this regarding?"
              bordered
              value={subject}
              onChange={setSubject}
            />

            <Textarea
              label="Message Details"
              placeholder="Tell us more about your inquiry..."
              bordered
              value={text}
              onChange={setText}
            />
          </View>
        </View>

        {/* --- SUBMIT ACTION --- */}
        <View className="mb-10">
          <Button
            type="primary"
            label="Send Message"
            buttonClassName="h-14 rounded-2xl shadow-xl shadow-purple-200"
            textClassName="text-lg font-poppins-bold"
            icon={
              <MaterialCommunityIcons name="send" size={18} color="white" />
            }
            iconPosition="right"
            disabled={!isValid}
            loading={submitLoading}
            onPress={handleSubmit}
          />

          <View className="flex-row items-center justify-center mt-6">
            <Feather name="lock" size={12} color="#94a3b8" />
            <Text className="text-[11px] text-slate-400 font-dm-sans-medium ml-2">
              Your data is encrypted and handled securely.
            </Text>
          </View>
        </View>
      </View>
    </SimpleContainer>
  );
};

export default ContactUs;
