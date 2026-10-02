import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        accent:
          "border-transparent bg-accent text-accent-foreground shadow-xs",
        outline:
          "border-border text-foreground bg-background/50 backdrop-blur-xs",
        success:
          "border-transparent bg-emerald-600 text-white",
        warning:
          "border-transparent bg-amber-500 text-white",
        sand:
          "border-border/60 bg-muted/80 text-foreground/80 lowercase first-letter:uppercase",
        difficultyEasy:
          "border-emerald-700/20 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
        difficultyModerate:
          "border-amber-700/20 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
        difficultyChallenging:
          "border-rose-700/20 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
