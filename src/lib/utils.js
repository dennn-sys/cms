import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formattedDate() {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "short" });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  return `${month} ${day}, ${year}`;
}
