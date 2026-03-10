import { useRouter } from "expo-router";
import { IUser } from "../types/user";

const useRedirect = () => {
  const router = useRouter();

  const redirect = (user: IUser) => {
    if (user.blocked) {
      router.replace("/auth/login");
      return;
    } else if (!user.emailVerified) {
      router.replace("/auth/login");
      return;
    } else if (!user.location?.country?.name || !user.phone) {
      router.replace("/auth/onboarding/step1");
      return;
    } else if (!user.title) {
      router.replace("/auth/onboarding/step2");
      return;
    } else if (!user.preferred?.category) {
      router.replace("/auth/onboarding/step4");
      return;
    } else {
      router.replace("/home");
      return;
    }
  };

  return { redirect };
};

export default useRedirect;
