"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, BarChart3, PieChart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} HeroAction
 * @property {string} text
 * @property {string} href
 * @property {React.ReactNode} [icon]
 * @property {"default" | "outline" | "secondary" | "ghost" | "link" | "glow"} [variant]
 */

/**
 * @typedef {Object} HeroProps
 * @property {Object} [badge]
 * @property {string} badge.text
 * @property {Object} [badge.action]
 * @property {string} badge.action.text
 * @property {string} badge.action.href
 * @property {string} title
 * @property {string} description
 * @property {HeroAction[]} actions
 * @property {React.ReactNode} [image]
 */

const Glow = React.forwardRef(
  ({ className, variant = "top", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute w-full",
        {
          "top-0": variant === "top",
          "-top-[128px]": variant === "above",
          "bottom-0": variant === "bottom",
          "-bottom-[128px]": variant === "below",
          "top-[50%]": variant === "center",
        },
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand-foreground)/.5)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[512px]",
          variant === "center" && "-translate-y-1/2",
        )}
      />
      <div
        className={cn(
          "absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand)/.3)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[256px]",
          variant === "center" && "-translate-y-1/2",
        )}
      />
    </div>
  )
);
Glow.displayName = "Glow";

const MockupFrame = React.forwardRef(
  ({ className, size = "small", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-accent/5 flex relative z-10 overflow-hidden rounded-2xl",
        {
          "p-2": size === "small",
          "p-4": size === "large",
        },
        className
      )}
      {...props}
    />
  )
);
MockupFrame.displayName = "MockupFrame";

const FinancialChart = () => {
  return (
    <div className="relative bg-black/40 backdrop-blur-sm border border-white/5 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-white">Financial Overview</h3>
        <div className="flex space-x-2">
          <Badge variant="outline" className="text-xs border-white/10">Monthly</Badge>
          <Badge variant="outline" className="text-xs border-white/10">Annual</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs text-white/60">Revenue</p>
          <p className="text-lg font-semibold text-white">$24,563</p>
          <p className="text-xs text-green-400">+12.5%</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-white/60">Expenses</p>
          <p className="text-lg font-semibold text-white">$15,202</p>
          <p className="text-xs text-red-400">+3.2%</p>
        </div>
      </div>
      
      <div className="h-32 flex items-end space-x-2">
        {[40, 65, 50, 80, 60, 55, 75, 70, 85, 90, 75].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-primary/80 rounded-t-sm" 
              style={{ height: `${height}%` }}
            />
            <span className="text-[10px] mt-1 text-white/70">{i + 1}</span>
          </div>
        ))}
      </div>
      
      <div className="absolute top-3 right-3 flex space-x-1">
        <BarChart3 className="h-4 w-4 text-white/50" />
        <PieChart className="h-4 w-4 text-white/50" />
      </div>
    </div>
  );
};

const DashboardElement = () => {
  return (
    <div className="relative bg-black/40 backdrop-blur-sm border border-white/5 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-white">Donation Tracking</h3>
        <Badge variant="outline" className="text-xs border-white/10">Q2 2023</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-xs text-white/60">Total Donations</p>
          <p className="text-lg font-semibold text-white">$128,450</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-white/60">Donors</p>
          <p className="text-lg font-semibold text-white">1,245</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/80">
            <span>Program A</span>
            <span>65%</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/80">
            <span>Program B</span>
            <span>42%</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }} />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/80">
            <span>Program C</span>
            <span>78%</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: "78%" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}) {
  return (
    <section
      className={cn(
        "relative bg-black/30 backdrop-blur-md text-foreground",
        "py-12 sm:py-24 md:py-32 px-4",
        "fade-bottom overflow-hidden border-b border-white/5"
      )}
    >
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {/* Badge */}
          {badge && (
            <Badge variant="outline" className="animate-appear gap-2 bg-black/30 backdrop-blur-sm border-white/10">
              <span className="text-white">{badge.text}</span>
              {badge.action && (
                <a href={badge.action.href} className="flex items-center gap-1">
                  {badge.action.text}
                  <ArrowRightIcon className="h-3 w-3" />
                </a>
              )}
            </Badge>
          )}

          {/* Title */}
          <h1 className="relative z-10 inline-block animate-appear text-4xl font-semibold leading-tight text-white drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-7xl md:leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-white/80 opacity-0 delay-100 sm:text-xl">
            {description}
          </p>

          {/* Actions */}
          <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
            {actions.map((action, index) => (
              <Button 
                key={index} 
                variant={action.variant || "default"} 
                size="lg" 
                className={cn(
                  index === 0 ? "bg-primary text-white hover:bg-primary/90" : "bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 text-white"
                )}
                asChild
              >
                <a href={action.href} className="flex items-center gap-2">
                  {action.text}
                  {action.icon}
                </a>
              </Button>
            ))}
          </div>

          {/* Floating Graphics */}
          <div className="relative pt-12 w-full max-w-4xl mx-auto">
            <MockupFrame className="animate-appear opacity-0 delay-700 bg-black/30 backdrop-blur-md border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                <FinancialChart />
                <DashboardElement />
              </div>
            </MockupFrame>
            <Glow variant="top" className="animate-appear-zoom opacity-0 delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HeroSectionDemo() {
  return (
    <HeroSection
      badge={{
        text: "Next-gen financial platform",
      }}
      title="Financial Management Made Simple"
      description="FiscalFusion offers powerful tools with an intuitive interface and affordable pricing designed for growing businesses."
      actions={[
        {
          text: "Start Free Trial",
          href: "/register",
          variant: "default",
        },
        {
          text: "Explore Features",
          href: "/features",
          variant: "outline",
        },
      ]}
    />
  );
} 