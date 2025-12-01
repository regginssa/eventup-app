import { ApiResponse, AuthResponse } from "@/types/api";
import AxiosInstance from "../AxiosInstance";
import {
  EMAIL_LOGIN,
  EMAIL_REGISTER,
  GOOGLE_LOGIN,
  GOOGLE_REGISTER,
} from "../apis";

export const googleLogin = async (
  email: string,
  google_id: string
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(GOOGLE_LOGIN, { email, google_id });
};

export const googleRegister = async (
  name: string,
  email: string,
  google_id: string,
  avatar: string
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(GOOGLE_REGISTER, {
    name,
    email,
    google_id,
    avatar,
  });
};

export const emailLogin = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(EMAIL_LOGIN, { email, password });
};

export const emailRegister = async (
  name: string,
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(EMAIL_REGISTER, { name, email, password });
};
