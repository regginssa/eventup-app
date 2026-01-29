import { fetchUser } from "@/src/api/services/user";
import { setAuth } from "@/src/store/slices/auth.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import useRedirect from "./useRedirect";

const useInit = () => {
  const { redirect } = useRedirect();
  const dispatch = useDispatch();

  const initializeUser = async () => {
    const token = await AsyncStorage.getItem("Authorization");
    if (!token) return;

    const decoded = jwtDecode(token) as any;
    if (!decoded.id) return;

    try {
      const response = await fetchUser(decoded.id);

      if (response.ok) {
        dispatch(setAuth({ isAuthenticated: true, user: response.data }));
        redirect(response.data);

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
    const user = await initializeUser();

    // if (!user?._id) return;
    // await initializeEvents(user._id);
  };

  return { initialize };
};

export default useInit;
