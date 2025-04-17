import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * @typedef {Object} GradientCTAProps
 * @property {string} [title="Join us today"]
 * @property {string} [description="Sign up now and start building amazing experiences with our platform."]
 * @property {string} [buttonText="Sign Up"]
 * @property {string} [buttonHref="#"]
 * @property {string} [className]
 */

/**
 * @param {GradientCTAProps} props
 */
function GradientCTA({
  title = "Join us today",
  description = "Sign up now and start building amazing experiences with our platform.",
  buttonText = "Sign Up",
  buttonHref = "#",
  className,
}) {
  return (
    <section
      className={cn(
        "group relative overflow-hidden py-24 sm:py-32 border-t border-white/5",
        className
      )}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:gap-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl animate-fade-in">
          {title}
        </h2>
        <p className="max-w-2xl text-lg text-white/80 animate-fade-in delay-100">
          {description}
        </p>
        <Button 
          size="lg" 
          className="mt-2 animate-fade-in delay-200 group bg-primary text-white hover:bg-primary/90"
          asChild
        >
          <a href={buttonHref} className="flex items-center gap-2">
            {buttonText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
      
      <div className="absolute -bottom-[40%] left-[50%] w-[80%] h-[80%] -translate-x-1/2 rounded-full opacity-20 blur-[100px]" style={{ background: "linear-gradient(180deg, #0A4B98 0%, #003329 100%)" }} />
    </section>
  );
}

// Usage example
function CTAExample() {
  return (
    <GradientCTA
      title="Ready to transform your financial operations?"
      description="Join thousands of businesses who have streamlined their finances with FiscalFusion's powerful yet easy-to-use platform."
      buttonText="Start Free 30-Day Trial"
      buttonHref="/register"
    />
  );
}

export default CTAExample; 