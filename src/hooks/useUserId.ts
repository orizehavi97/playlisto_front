import { useState, useEffect } from "react";

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(() => {
    // Try to get from localStorage first
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null;
  });

  useEffect(() => {
    if (userId) return;

    // Generate new userId if none exists
    const newUserId = crypto.randomUUID();
    setUserId(newUserId);
    localStorage.setItem("userId", newUserId);
  }, [userId]);

  return userId;
}
