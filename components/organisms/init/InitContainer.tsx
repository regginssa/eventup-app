import useAuth from "@/hooks/useAuth";
import useInit from "@/hooks/useInit";
import { RootState } from "@/store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const InitContainer = () => {
  const authenticate = useAuth();
  const { initialize } = useInit();

  const { user } = useSelector((state: RootState) => state.auth);

  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  return <></>;
};

export default InitContainer;
