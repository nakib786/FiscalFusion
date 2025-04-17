"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * @typedef {Object} Testimonial
 * @property {string} quote
 * @property {string} name
 * @property {string} designation
 * @property {string} [company]
 * @property {string} src
 */

/**
 * @typedef {Object} TestimonialCarouselProps
 * @property {Testimonial[]} testimonials
 * @property {boolean} [autoplay=true]
 */

/**
 * @param {TestimonialCarouselProps & React.HTMLAttributes<HTMLDivElement>} props
 * @param {React.Ref<HTMLDivElement>} ref
 */
export const TestimonialCarousel = React.forwardRef(
  ({ className, testimonials, autoplay = true, ...props }, ref) => {
    const [api, setApi] = React.useState(null);
    const [active, setActive] = React.useState(0);

    const handleNext = React.useCallback(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
      api?.scrollNext();
    }, [api, testimonials.length]);

    const handlePrev = React.useCallback(() => {
      setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      api?.scrollPrev();
    }, [api, testimonials.length]);

    React.useEffect(() => {
      if (!api) return;
      
      api.on("select", () => {
        setActive(api.selectedScrollSnap());
      });
    }, [api]);

    React.useEffect(() => {
      if (autoplay) {
        const interval = setInterval(handleNext, 5000);
        return () => clearInterval(interval);
      }
    }, [autoplay, handleNext]);

    return (
      <div 
        ref={ref} 
        className={cn("py-16 bg-background", className)} 
        {...props}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
              Trusted by businesses worldwide to deliver exceptional results
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-full">
                    <div className="flex flex-col md:flex-row gap-8 items-center p-6 md:p-8">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                        <Avatar className="w-full h-full border-4 border-background shadow-lg">
                          <AvatarImage 
                            src={testimonial.src} 
                            alt={testimonial.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-xl">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1 flex flex-col text-center md:text-left">
                        <div className="mb-4 text-primary">
                          <Quote className="h-8 w-8 mx-auto md:mx-0" />
                        </div>
                        
                        <motion.p 
                          key={active}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-lg md:text-xl text-foreground mb-4 italic"
                        >
                          {testimonial.quote}
                        </motion.p>
                        
                        <div className="mt-auto">
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.designation}</p>
                          {testimonial.company && (
                            <p className="text-sm font-medium text-primary mt-1">{testimonial.company}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    api?.scrollTo(index);
                    setActive(index);
                  }}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    index === active ? "bg-primary" : "bg-primary/30"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex justify-center mt-6 gap-4">
              <button
                onClick={handlePrev}
                className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center group hover:bg-secondary/80 transition-colors"
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="h-5 w-5 text-foreground group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center group hover:bg-secondary/80 transition-colors"
                aria-label="Next testimonial"
              >
                <ArrowRight className="h-5 w-5 text-foreground group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TestimonialCarousel.displayName = "TestimonialCarousel";

function TestimonialCarouselDemo() {
  const testimonials = [
    {
      quote: "FiscalFusion completely transformed our financial workflow. The intuitive design has significantly improved our team's efficiency and productivity.",
      name: "Sarah Chen",
      designation: "CFO",
      company: "TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: "We reduced our accounting software costs by 30% with FiscalFusion. The migration was seamless and the platform offers powerful features tailored to our specific industry needs.",
      name: "Michael Rodriguez",
      designation: "Finance Director",
      company: "InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: "FiscalFusion was perfect for our small team with its minimal learning curve. We gained comprehensive reporting capabilities without the complexity, and our team was productive from day one.",
      name: "Emily Watson",
      designation: "Accounting Manager",
      company: "CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: "The tax preparation features in FiscalFusion are outstanding. We identified additional deductions we were missing before, saving our company thousands of dollars in our first year.",
      name: "James Kim",
      designation: "Controller",
      company: "DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return <TestimonialCarousel testimonials={testimonials} />;
}

export default TestimonialCarouselDemo; 