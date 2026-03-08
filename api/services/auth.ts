import { ApiResponse, AuthResponse } from "@/types/api";
import { IUser } from "@/types/user";
import AxiosInstance from "../client";
import {
  EMAIL_LOGIN,
  EMAIL_REGISTER,
  GET_ME,
  GOOGLE_LOGIN,
  GOOGLE_REGISTER,
} from "../endpoints";

export const googleLogin = async (
  email: string,
  google_id: string,
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(GOOGLE_LOGIN, { email, google_id });
};

export const googleRegister = async (
  name: string,
  email: string,
  google_id: string,
  avatar: string,
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
  password: string,
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(EMAIL_LOGIN, { email, password });
};

export const emailRegister = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(EMAIL_REGISTER, {
    firstName,
    lastName,
    email,
    password,
  });
};

export const getMe = async (): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.get(GET_ME);
};
