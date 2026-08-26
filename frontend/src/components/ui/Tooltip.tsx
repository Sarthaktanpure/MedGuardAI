import * as React from "react";
import { cn } from "../../lib/utils/cn";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 shadow-md animate-in fade-in-50 zoom-in-95 dark:bg-slate-50 dark:text-slate-900",
            className
          )}
          role="tooltip"
        >
          {content}
          <div className="absolute top-full left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-0.5 rotate-45 bg-slate-900 dark:bg-slate-50" />
        </div>
      )}
    </div>
  );
}
