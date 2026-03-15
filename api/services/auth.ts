import { ApiResponse, AuthResponse } from "@/types/api";
import { IUser } from "@/types/user";
import AxiosInstance from "../client";

const BASE_URL = "/auth";

export const googleRegister = async (
  firstName: string,
  lastName: string,
  email: string,
  googleId: string,
  avatar: string,
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(BASE_URL + "/register/google", {
    firstName,
    lastName,
    email,
    googleId,
    avatar,
  });
};

export const appleRegister = async (
  body: any,
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(BASE_URL + "/register/apple", body);
};

export const emailRegister = async (
  firstName: string,
  lastName: string,
  name: string,
  email: string,
  password: string,
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(BASE_URL + "/register/email", {
    firstName,
    lastName,
    name,
    email,
    password,
  });
};

export const googleLogin = async (
  email: string,
  googleId: string,
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(BASE_URL + "/login/google", {
    email,
    googleId,
  });
};

export const appleLogin = async (
  body: any,
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(BASE_URL + "/login/apple", body);
};

export const emailLogin = async (
  email: string,
  password: string,
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(BASE_URL + "/login/email", {
    email,
    password,
  });
};

export const verifyOtp = async (
  body: any,
): Promise<ApiResponse<AuthResponse>> => {
  return await AxiosInstance.post(BASE_URL + "/verify/otp", body);
};

export const resendOtp = async (
  email: string,
): Promise<ApiResponse<boolean>> => {
  return await AxiosInstance.get(BASE_URL + "/verify/otp/resend", {
    params: { email },
  });
};

export const forgotPassword = async (
  email: string,
): Promise<ApiResponse<string>> => {
  return await AxiosInstance.post(BASE_URL + "/forgot-password", { email });
};

export const resetAuthPassword = async (
  newPassword: string,
): Promise<ApiResponse<null>> => {
  return await AxiosInstance.patch(BASE_URL + "/reset-password", {
    newPassword,
  });
};

export const changeAuthPassword = async (
  body: any,
): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.patch(BASE_URL + "/change-password", body);
};

export const getMe = async (): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.get(BASE_URL + "/me");
};

export const removeMe = async (): Promise<ApiResponse<boolean>> => {
  return await AxiosInstance.delete(BASE_URL + "/me");
};
