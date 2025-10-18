import { apiClient } from "@/lib/api";
import type { ApiResponse } from "@/lib/type";
import { loginSchema, type LoginSchema } from "@/schemas/loginSchema";
import { registerSchema, type RegisterSchema } from "@/schemas/registerSchema";
import type { User } from "@/schemas/userSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

const login = async (credentials: LoginSchema) => {
  loginSchema.parse(credentials);
  const data: any = await apiClient.post("/login", credentials);
  console.log({ data });
  Cookies.set("session_token", data.content.token, { expires: 7 });
  return data;
};
const register = async (credentials: RegisterSchema) => {
  registerSchema.parse(credentials);
  console.log({ credentials });
  const data: any = await apiClient.post("/register", credentials);
  return data;
};
const logout = async () => {
  Cookies.remove("session_token");
  return Promise.resolve();
};
const getCurrentUser = async (): Promise<ApiResponse<User> | null> => {
  const token = Cookies.get("session_token");
  if (!token) return null;
  return apiClient.get("/auth/me");
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (e) => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};
export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: (e) => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: (e) => {
      queryClient.setQueryData(authKeys.user(), null);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: getCurrentUser,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
