import { useAuth } from "@/components/providers/AuthProvider";
import useInit from "@/hooks/useInit";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const InitContainer = () => {
  const { initialize } = useInit();

  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  return <></>;
};

export default InitContainer;
