import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class names
 * @param inputs - The class names to merge
 * @returns The merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const URL_REGEX = /^https?:\/\//i;

/**
 * Formats a URL
 * @param link - The URL to format
 * @returns The formatted URL
 */
export function formatUrl(link: string): string {
  const url = link.trim();
  if (!URL_REGEX.test(url)) {
    return `https://${url}`;
  }
  return url;
}

const URL_CLEANUP_REGEX = /(https?:\/\/)?(www\.)?/i;

/**
 * Removes the URL prefix from a string
 * @param url - The URL to remove the prefix from
 * @returns The URL without the prefix
 */
export function cleanupUrl(url: string): string {
  return url.replace(URL_CLEANUP_REGEX, "");
}

/**
 * Removes the leading slash from a string
 * @param path - The path to remove the leading slash from
 * @returns The path without a leading slash
 */
export function removeLeadingSlash(path: string): string {
  return path.startsWith("/") ? path.slice(1) : path;
}
