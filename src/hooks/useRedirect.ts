import { IUser } from "@/types/data";
import { useRouter } from "expo-router";

const useRedirect = () => {
  const router = useRouter();

  const redirect = (user: IUser) => {
    if (user.is_blocked) {
      router.replace("/auth/login");
    } else if (!user.location.country) {
      router.replace("/onboarding/step1");
    } else if (!user.title) {
      router.replace("/onboarding/step2");
    } else if (!user.preferred.category) {
      router.replace("/onboarding/step4");
    } else {
      router.replace("/home");
    }
  };

  return { redirect };
};

export default useRedirect;
