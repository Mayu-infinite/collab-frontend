import { User } from "../user/interface";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
  user: User;
}
