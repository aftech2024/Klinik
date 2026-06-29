import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function btn(
  variant: "primary" | "outline" | "ghost" = "primary",
  size: "sm" | "md" | "lg" = "md",
  extra = ""
) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500";
  const sizes = { sm: "h-8 px-4 text-sm", md: "h-10 px-5 text-sm", lg: "h-12 px-8 text-base" };
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    outline: "border border-white/40 text-white hover:bg-white/10",
    ghost: "text-gray-700 hover:bg-gray-100",
  };
  return cn(base, sizes[size], variants[variant], extra);
}
