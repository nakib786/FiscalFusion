"use client";
import React from "react";
import { cn } from "../../../lib/utils";

export const AuroraBackground = ({
  children,
  className,
  containerClassName,
  gradientClassName,
  glowClassName,
  showGlow = true,
  primaryColor = "hsl(var(--primary-500))",
}) => {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-lg bg-slate-950",
        containerClassName
      )}
    >
      <div
        className={cn(
          "absolute inset-0 z-10 h-full",
          "bg-transparent",
          className
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "absolute inset-0 z-0",
          "bg-gradient-to-b from-slate-900 to-slate-950",
          gradientClassName
        )}
      />
      {showGlow && (
        <div
          className={cn(
            "absolute left-[10%] top-[10%] -z-10 h-[30%] w-[30%]",
            "rounded-full bg-indigo-500 opacity-20 blur-[100px]",
            "animate-aurora-1",
            glowClassName
          )}
          style={{
            backgroundColor: primaryColor,
            animationDelay: "0s",
          }}
        />
      )}
      {showGlow && (
        <div
          className={cn(
            "absolute bottom-[10%] right-[10%] -z-10 h-[30%] w-[30%]",
            "rounded-full bg-indigo-500 opacity-20 blur-[100px]",
            "animate-aurora-2",
            glowClassName
          )}
          style={{
            backgroundColor: primaryColor,
            animationDelay: "0.5s",
          }}
        />
      )}
      {showGlow && (
        <div
          className={cn(
            "absolute right-[40%] top-[20%] -z-10 h-[30%] w-[40%]",
            "rounded-full bg-indigo-500 opacity-25 blur-[100px]",
            "animate-aurora-3",
            glowClassName
          )}
          style={{
            backgroundColor: primaryColor,
            animationDelay: "1s",
          }}
        />
      )}
    </div>
  );
};

export default AuroraBackground; 