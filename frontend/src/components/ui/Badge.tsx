import * as React from "react";
import { cn } from "../../lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "muted"
    | "genuine"
    | "suspect"
    | "fake";
}

export function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    primary: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-border text-foreground",
    muted: "border-transparent bg-muted text-muted-foreground",
    // Verdict styling (compliant with WCAG AA contrast ratios)
    genuine: "border-genuine/30 bg-genuine/10 text-genuine",
    suspect: "border-suspect/30 bg-suspect/10 text-suspect-foreground dark:text-suspect",
    fake: "border-fake/30 bg-fake/10 text-fake",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
}
