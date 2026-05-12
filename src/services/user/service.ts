import axios from "axios";
import { api } from "@/lib/axios";
import { ApiErrorResponse } from "../interfaces/error/interface";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export const getUser = async (): Promise<CurrentUser> => {
  try {
    const res = await api.get("/users/me");
    if (!res) {
      throw new Error("User not Logged in");
    }

    return res.data;
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }

    throw new Error("Unexpected error occurred");
  }
};
