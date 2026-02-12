import { getMe } from "@/api/services/auth";
import { IUser } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: IUser | null;
  setAuthUser: (val: IUser | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be within AuthProvider");
  }

  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("Authorization");

        if (!token) {
          if (
            pathname !== "/start" &&
            pathname !== "/auth/login" &&
            pathname !== "/auth/register"
          )
            router.replace("/start");
          setAuthChecked(true);
          return;
        }

        const decoded = jwtDecode(token) as any;
        const now = Date.now() / 1000;

        if (!decoded.exp || decoded.exp < now) {
          await AsyncStorage.removeItem("Authorization");
          if (pathname !== "/start") router.replace("/start");
          setAuthChecked(true);
          return;
        }

        // Token valid
        setAuthChecked(true);
      } catch (err) {
        await AsyncStorage.removeItem("Authorization");
        if (pathname !== "/start") router.replace("/start");
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const fetchMe = async () => {
      if (!authChecked) return;
      if (user) return;

      const token = await AsyncStorage.getItem("Authorization");
      if (!token) return;

      const response = await getMe();
      if (!response.data) return;

      setUser(response.data);
    };

    fetchMe();
  }, [authChecked]);

  useEffect(() => {
    if (!user) return;

    if (user.blocked) {
      router.replace("/auth/login");
    } else if (!user.location?.country?.name) {
      router.replace("/auth/onboarding/step1");
    } else if (!user.title) {
      router.replace("/auth/onboarding/step2");
    } else if (!user.preferred?.category) {
      router.replace("/auth/onboarding/step4");
    } else {
      router.replace("/home");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, setAuthUser: setUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
