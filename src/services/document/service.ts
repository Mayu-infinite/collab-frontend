import { api } from "@/lib/axios";
import axios from "axios";
import { ApiErrorResponse } from "../intefaces/error/interface";

export const createDocument = async(title: string) => {
  try {
    const res = await api.post("/documents",{
      title: title,
      content: "",
    })

    if(!res){
      throw new Error("Error Creating Document")
    }

    return res;
  }catch(error: any){
    if(axios.isAxiosError<ApiErrorResponse>(error)){
      const message = error.response?.data?.message;
      throw new Error(message);
    }

    throw new Error("Unexpected Error Occured");
  }
}
