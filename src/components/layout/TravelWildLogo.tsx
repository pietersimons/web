"use client";

import { cn } from "@/lib/utils";

interface TravelWildLogoProps {
  className?: string;
  iconClassName?: string;
  theme?: "light" | "dark" | "auto";
}

export function TravelWildLogo({
  className,
  iconClassName,
  theme = "auto",
}: TravelWildLogoProps) {
  const textColor =
    theme === "light"
      ? "text-white"
      : theme === "dark"
      ? "text-primary"
      : "text-foreground";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center select-none group transition-opacity hover:opacity-95",
        textColor,
        className
      )}
    >
      {/* Mountain Ridge Icon */}
      <svg
        viewBox="0 0 120 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "w-12 sm:w-14 h-auto transition-transform duration-300 group-hover:scale-105",
          iconClassName
        )}
        aria-hidden="true"
      >
        {/* Left Peak */}
        <path
          d="M18 32 L36 17 L46 26"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 34 L36 22 L44 29"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center Main Peak */}
        <path
          d="M46 26 L63 7 L84 27"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Center Ridge & Snowcap */}
        <path
          d="M63 7 L65 19 L63 24"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <polygon points="63,8 67,16 64,18" fill="currentColor" stroke="none" />

        {/* Right Peak */}
        <path
          d="M78 27 L88 18 L101 31"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M81 31 L88 23 L96 31"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Typography: TRAVEL WILD */}
      <div className="flex flex-col items-center text-center mt-1">
        <span className="font-brand text-[10px] sm:text-[11px] tracking-[0.26em] font-medium leading-none uppercase pl-[0.26em]">
          TRAVEL
        </span>
        <span className="font-brand text-[16px] sm:text-[20px] tracking-[0.08em] font-bold leading-tight uppercase pl-[0.08em]">
          WILD
        </span>
      </div>
    </div>
  );
}
