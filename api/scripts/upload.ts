import { SERVER_API_ENDPOINT } from "@/constants/env";
import { ApiResponse } from "@/types/api";
import axios from "axios";
import { UPLOAD } from "../apis";

export const uploadFile = async (
  formData: FormData
): Promise<ApiResponse<string | null>> => {
  try {
    const response = await axios.post(SERVER_API_ENDPOINT + UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: "",
    };
  }
};
