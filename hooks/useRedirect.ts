import { useRouter } from "expo-router";
import { IUser } from "../types/user";

const useRedirect = () => {
  const router = useRouter();

  const redirect = (user: IUser) => {
    if (user.blocked) {
      router.replace("/auth/login");
    } else if (!user.location.country.name) {
      router.replace("/auth/onboarding/step1");
    } else if (!user.title) {
      router.replace("/auth/onboarding/step2");
    } else if (!user.preferred.category) {
      router.replace("/auth/onboarding/step4");
    } else {
      router.replace("/home");
    }
  };

  return { redirect };
};

export default useRedirect;
