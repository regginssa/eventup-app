import { IUser } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useRef, useState } from "react";

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
  const hasRun = useRef(false);

  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <AuthContext.Provider
      value={{ user, setAuthUser: setUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
