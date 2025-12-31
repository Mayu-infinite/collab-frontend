import axios from "axios";
import { api } from "@/lib/axios";
import { ApiErrorResponse } from "../intefaces/error/interface";

export const getUser = async (): Promise<Boolean> => {
  try {
    const res = await api.get("/users/me");
    if (!res) {
      throw new Error("User not Logged in");
    }

    return true;
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }

    throw new Error("Unexpected error occurred");
  }
};
