import type { User } from "@/schemas/userSchema";
export interface ListContent<K> {
  entries: K[];
  // Mungkin juga ada metadata lain di sini, seperti info paginasi
  totalData: number; // Nama field di JSON
  totalPage: number; // Nama field di JSON
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  content: T;
}

export interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
