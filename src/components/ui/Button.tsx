"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const variants = {
      primary: "bg-brand-accent text-white hover:opacity-90 text-shadow-hero",
      outline: "border border-celeste-oh text-celeste-oh hover:bg-celeste-oh/5",
      ghost: "text-onyx hover:bg-onyx/5",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celeste-oh disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
