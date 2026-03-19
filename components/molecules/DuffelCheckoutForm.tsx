import { DuffelCardForm } from "@duffel/react-native-components";
import { Text, View } from "react-native";

interface DuffelCheckoutFormProps {
  clientKey: string;
  onSuccess: () => Promise<void>;
  onFailure: () => Promise<void>;
}

const DuffelCheckoutForm: React.FC<DuffelCheckoutFormProps> = ({
  clientKey,
  onSuccess,
  onFailure,
}) => {
  return (
    <View className="w-full gap-4">
      <View className="p-5 rounded-[24px]">
        {/* HEADER */}
        <View className="mb-5">
          <Text className="text-lg font-bold text-slate-800 font-poppins-semibold">
            Card Details
          </Text>
          <Text className="text-xs font-dm-sans-medium text-slate-400 mt-1">
            Enter your card information securely
          </Text>
        </View>

        {/* UX EXPLANATION */}
        <View className="mb-4 rounded-xl bg-slate-100 p-3">
          <Text className="text-xs font-dm-sans-medium text-slate-500 leading-5">
            To securely process your{" "}
            <Text className="font-poppins-semibold text-slate-700">
              flight and hotel bookings
            </Text>
            , we use Provider's trusted payment system. Your card details are
            encrypted and sent directly to the airline or travel provider — we
            never store your sensitive information.
          </Text>
        </View>

        {/* FORM */}
        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <DuffelCardForm
            clientKey={clientKey}
            intent="to-create-card-for-temporary-use"
            onValidateSuccess={onSuccess}
            onValidateFailure={onFailure}
          />
        </View>
      </View>
    </View>
  );
};

export default DuffelCheckoutForm;
