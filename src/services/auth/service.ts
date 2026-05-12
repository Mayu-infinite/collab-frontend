import axios from "axios";
import { ApiErrorResponse } from "../interfaces/error/interface"
import { LoginPayload, LoginResponse, SignUpPayload, SignUpResponse } from "../interfaces/auth/interface";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const getGoogleAuthUrl = () => `${BASE_API_URL}/auth/google`;

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const { data } = await axios.post<LoginResponse>(
      `${BASE_API_URL}/auth/login`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message || "Login Failed";
      throw new Error(message);
    }

    throw new Error("Unexpected error occured");
  }
};

export const signup = async (
  payload: SignUpPayload,
): Promise<SignUpResponse> => {
  try {
    const { data } = await axios.post<SignUpResponse>(
      `${BASE_API_URL}/auth/signup`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message || "SignUp Failed";
      throw new Error(message);
    }

    throw new Error("Unexpected error occured");
  }
};
