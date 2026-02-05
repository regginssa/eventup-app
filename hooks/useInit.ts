import { fetchUser } from "@/api/services/user";
import { useAuth } from "@/components/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import useRedirect from "./useRedirect";

const useInit = () => {
  const { redirect } = useRedirect();
  const { setAuthUser } = useAuth();

  const initializeUser = async () => {
    const token = await AsyncStorage.getItem("Authorization");
    if (!token) return;

    const decoded = jwtDecode(token) as any;
    if (!decoded.id) return;

    try {
      const response = await fetchUser(decoded.id);

      if (response.data) {
        redirect(response.data);
        setAuthUser(response.data);
        return response.data;
      }
    } catch (error) {}
  };

  // const initializeEvents = async (userId: string) => {
  //   try {
  //     dispatch(setEventLoading(true));
  //     const response = await fetchEventsFeed(userId, 1, 10);
  //     if (response.ok) {
  //       dispatch(setAllEvents(response.data.events));
  //       dispatch(setPagination(response.data.pagination));
  //     }
  //   } catch (error) {
  //     console.error("initialize events error: ", error);
  //   } finally {
  //     dispatch(setEventLoading(false));
  //   }
  // };

  const initialize = async () => {
    await initializeUser();
  };

  return { initialize };
};

export default useInit;
