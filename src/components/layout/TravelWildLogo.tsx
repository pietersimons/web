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
      {/* Mountain Monogram Icon (T-Mountain-W) */}
      <svg
        viewBox="0 0 545 240"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "w-12 sm:w-14 h-auto transition-transform duration-300 group-hover:scale-105",
          iconClassName
        )}
        aria-hidden="true"
      >
        <path d="M272 1L315 81L319 81L334 71L388 203L431 111L475 202L528 73L543 73L475 239L432 146L387 238L329 95L327 93L311 103L298 81L287 101L294 125L267 173L278 127L265 106L271 30L189 155L176 142L172 145L113 235L73 235L73 73L2 72L2 58L195 58L186 72L87 72L87 220L104 220L173 117L186 130L190 127Z" />
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
