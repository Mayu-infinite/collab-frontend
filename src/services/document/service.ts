import { api } from "@/lib/axios";
import axios from "axios";
import { ApiErrorResponse } from "../interfaces/error/interface";

export type DocumentRole = "OWNER" | "EDITOR" | "VIEWER";

export type DocumentMember = {
  id: string;
  role: DocumentRole;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type DocumentResponse = {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  isCollaborative: boolean;
  inviteCode?: string | null;
  ownerId?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  currentUserRole?: DocumentRole;
  canEdit?: boolean;
  canDelete?: boolean;
  previewText?: string;
  memberCount?: number;
  members?: DocumentMember[];
};

type CollaborationResponse = {
  id: string;

  isCollaborative: boolean;

  inviteCode: string;
}

export const createDocument = async (title: string): Promise<DocumentResponse> => {
  try {
    const res = await api.post("/documents", {
      title: title,
      content: "",
    })

    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message;
      throw new Error(message || "Failed to create Document");
    }

    throw new Error("Unexpected Error Occured");
  }
}

export const getDocument = async (documentId: string): Promise<DocumentResponse> => {
  try {
    const res = await api.get(`/documents/${documentId}`)

    return res.data
  } catch (error: any) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message;
      throw new Error(message || "Failed to create Document");
    }

    throw new Error("Unexpected Error Occured");
  }
}

export const deleteDocument = async (
  documentId: string,
): Promise<{ id: string; deleted: boolean }> => {
  try {
    const res = await api.delete(`/documents/${documentId}`)

    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message;
      throw new Error(message || "Failed to delete document")
    }

    throw new Error("Unexpected Error Occured");
  }
}

export const enableCollaboration = async (
  documentId: string,
): Promise<CollaborationResponse> => {
  try {
    const res = await api.post(`/documents/${documentId}/collaborate`)

    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message;
      throw new Error(message || "Failed to enable Collaboration")
    }

    throw new Error("Unexpected Error Occured");
  }
}

export const disableCollaboration = async (
  documentId: string,
): Promise<CollaborationResponse> => {
  try {
    const res = await api.delete(`/documents/${documentId}/collaborate`)
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message;
      throw new Error(message || "Failed to disable Collaboration")
    }

    throw new Error("Unexpected error Occured");
  }
}

type JoinCollaborationResponse = {
  id: string;
  title: string;
};

export const joinCollaboration =
  async (
    inviteCode: string,
  ): Promise<JoinCollaborationResponse> => {
    try {
      const res =
        await api.post(
          `/documents/join/${inviteCode}`,
        );

      return res.data;
    } catch (error: any) {
      if (
        axios.isAxiosError<ApiErrorResponse>(
          error,
        )
      ) {
        const message =
          error.response?.data?.message;

        throw new Error(
          message ||
          "Failed to join collaboration",
        );
      }

      throw new Error(
        "Unexpected Error Occurred",
      );
    }
  };
