import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const toTitleCase = (str: string) => {
  return str.replace(/\b\w+\b/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
};