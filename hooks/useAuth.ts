import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";

const useAuth = () => {
  const pathname = usePathname();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const checkAuthenticate = async () => {
      const token = await AsyncStorage.getItem("Authorization");

      if (token) {
        const decoded = jwtDecode(token) as any;
        const now = Date.now() / 1000;

        if (!decoded.exp || decoded.exp < now) {
          await AsyncStorage.removeItem("Authorization");
          router.replace("/start");
        }
      } else {
        router.replace("/start");
      }
    };

    checkAuthenticate();
  }, [pathname]);
};

export default useAuth;
