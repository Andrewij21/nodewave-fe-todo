"use client";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";

export function AuthInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useAuthStore.getState().initializeAuth();
      initialized.current = true;
    }
  }, []);

  return null;
}
