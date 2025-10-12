import { type ClassValue, clsx } from "clsx";
import { format, isValid, parseISO } from "date-fns";
import readingTime from "reading-time";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, pattern = "MMM d, yyyy") {
  const target =
    typeof date === "string" ? parseISO(date) : new Date(date.valueOf());
  if (!isValid(target)) return "";
  return format(target, pattern);
}

export function formatFullDate(date: string | Date) {
  return formatDate(date, "EEEE, MMMM d, yyyy");
}

export function getReadingTime(text: string) {
  return readingTime(text).text;
}

export function getNewspaperDateline(date = new Date()) {
  return format(date, "EEEE, MMMM d, yyyy");
}
