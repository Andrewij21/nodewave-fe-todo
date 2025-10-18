import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string = ""): string => {
  // Pecah nama berdasarkan spasi dan filter jika ada spasi ganda
  const names = name.split(" ").filter(Boolean);

  if (names.length === 0) return "U"; // Default 'User'

  // Ambil huruf pertama dari nama pertama
  let initials = names[0][0];

  // Jika ada lebih dari satu nama (nama belakang), ambil huruf pertamanya
  if (names.length > 1) {
    initials += names[names.length - 1][0]; // Ambil inisial nama terakhir
  }

  return initials.toUpperCase();
};
