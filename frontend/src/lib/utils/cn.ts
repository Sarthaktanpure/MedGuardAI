import { clsx, type ClassValue } from "clsx";
import { bgToClass } from "postcss"; // wait, no need, just clsx and tailwind-merge
import { PureComponent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
