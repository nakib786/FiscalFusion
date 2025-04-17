// This template requires the Embla Auto Scroll plugin to be installed:
// npm install embla-carousel-auto-scroll

"use client";
import React, { useState, useEffect } from 'react';
import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

const Logos3 = ({
  heading = "Trusted by Leading Financial Institutions",

  logos = [
    {
      id: "logo-1",
      description: "JPMorgan Chase",
      image: "https://logos-world.net/wp-content/uploads/2021/02/JP-Morgan-Chase-Logo.png",
      className: "h-10 w-auto",
    },
    {
      id: "logo-2",
      description: "Mastercard",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/2560px-Mastercard-logo.svg.png",
      className: "h-9 w-auto",
    },
    {
      id: "logo-3",
      description: "Visa",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png",
      className: "h-7 w-auto",
    },
    {
      id: "logo-4",
      description: "American Express",
      image: "https://1000logos.net/wp-content/uploads/2016/10/American-Express-Color.png",
      className: "h-11 w-auto",
    },
    {
      id: "logo-5",
      description: "Goldman Sachs",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Goldman_Sachs.svg/1200px-Goldman_Sachs.svg.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-6",
      description: "Bank of America",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Bank_of_America_logo.svg/2560px-Bank_of_America_logo.svg.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-7",
      description: "Citibank",
      image: "https://cdn.worldvectorlogo.com/logos/citibank-4.svg",
      className: "h-10 w-auto",
    },
    {
      id: "logo-8",
      description: "HSBC",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/2560px-HSBC_logo_%282018%29.svg.png",
      className: "h-8 w-auto",
    },
  ]
}) => {
  const [emblaApi, setEmblaApi] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  // Handle mouse events
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (emblaApi) {
      emblaApi.plugins().autoScroll?.stop();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (emblaApi) {
      emblaApi.plugins().autoScroll?.play();
    }
  };

  return (
    <section className="py-14 relative overflow-hidden bg-gradient-to-b from-slate-800/40 to-slate-900/60 backdrop-blur-md w-screen">
      {/* Animated background gradient dots */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
            {heading}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>
      </div>
      
      <div 
        className="w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Carousel 
          setApi={setEmblaApi}
          opts={{ 
            loop: true,
            align: "start",
            containScroll: false,
          }} 
          plugins={[
            AutoScroll({
              playOnInit: true,
              speed: 1.2,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
            })
          ]} 
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {/* First set of logos */}
            {logos.map((logo) => (
              <CarouselItem
                key={logo.id}
                className="pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8"
              >
                <div className="rounded-xl bg-white/5 backdrop-blur-sm p-5 h-20 flex items-center justify-center border border-white/5 hover:border-white/20 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="opacity-90 hover:opacity-100 transition-all duration-300">
                    <img 
                      src={logo.image} 
                      alt={logo.description} 
                      className={logo.className} 
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
            
            {/* Repeat logos for continuous scrolling */}
            {logos.map((logo) => (
              <CarouselItem
                key={`repeat-${logo.id}`}
                className="pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8"
              >
                <div className="rounded-xl bg-white/5 backdrop-blur-sm p-5 h-20 flex items-center justify-center border border-white/5 hover:border-white/20 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="opacity-90 hover:opacity-100 transition-all duration-300">
                    <img 
                      src={logo.image} 
                      alt={logo.description} 
                      className={logo.className} 
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
            
            {/* Additional set for even more continuous scrolling */}
            {logos.map((logo) => (
              <CarouselItem
                key={`extra-${logo.id}`}
                className="pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8"
              >
                <div className="rounded-xl bg-white/5 backdrop-blur-sm p-5 h-20 flex items-center justify-center border border-white/5 hover:border-white/20 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="opacity-90 hover:opacity-100 transition-all duration-300">
                    <img 
                      src={logo.image} 
                      alt={logo.description} 
                      className={logo.className} 
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      {/* Gradient fade overlays */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-800/90 to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-800/90 to-transparent z-10"></div>
    </section>
  );
};

export { Logos3 };
