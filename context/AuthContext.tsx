"use client";
import { createContext, useContext, useEffect, useState } from "react";
// import Cookies from "js-cookie"; // Tidak terpakai di kode baru Anda
// import { useCurrentUser } from "@/queries/auth"; // Tidak terpakai
import type { AuthContextValue, AuthProviderProps } from "@/lib/type";
import type { User } from "@/schemas/userSchema";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // 1. Inisialisasi state ke 'null' agar render server dan klien awal sama.
  const [user, setUser] = useState<User | null>(null);

  // 2. Tambahkan state loading untuk menangani jeda saat membaca localStorage.
  const [loading, setLoading] = useState(true);

  // 3. Gunakan useEffect untuk membaca localStorage HANYA di sisi klien
  //    setelah komponen berhasil di-mount (hidrasi selesai).
  useEffect(() => {
    try {
      const item = window.localStorage.getItem("userSession");
      if (item) {
        setUser(JSON.parse(item) as User);
      }
    } catch (error) {
      console.warn("Error parsing user from localStorage", error);
      // Anda mungkin ingin menghapus item yang rusak dari localStorage di sini
      // window.localStorage.removeItem("userSession");
    } finally {
      // 4. Set loading ke false setelah selesai mencoba membaca localStorage.
      setLoading(false);
    }
  }, []); // Array kosong [] memastikan ini hanya berjalan sekali saat mount.

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {/* Anda bisa render children secara kondisional jika perlu.
        Contoh: Menampilkan spinner global saat loading.
        if (loading) {
          return <FullScreenLoader />;
        }
      */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
