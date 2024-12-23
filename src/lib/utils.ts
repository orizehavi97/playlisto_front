import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidInput = (playerName: string) => {
  return playerName.trim().length >= 2 && playerName.trim().length <= 20;
};
