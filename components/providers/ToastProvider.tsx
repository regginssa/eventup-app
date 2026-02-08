import React, { createContext, ReactNode, useContext, useState } from "react";
import { Toast } from "../common";
import { ToastType } from "../common/Toast";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastContextProps {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warn: (msg: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }

  return ctx;
};

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ message, type, visible: true });

    setTimeout(() => {
      setToast((s) => ({ ...s, visible: false }));
    }, 2500);
  };

  const api = {
    success: (msg: string) => showToast("success", msg),
    error: (msg: string) => showToast("error", msg),
    info: (msg: string) => showToast("info", msg),
    warn: (msg: string) => showToast("warn", msg),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast.visible && <Toast message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
