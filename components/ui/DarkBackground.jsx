"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { DollarSign, TrendingUp, Shield, BarChart4 } from "lucide-react";

/**
 * @typedef {Object} AnimatedGradientBackgroundProps
 * @property {number} [startingGap=125] - Initial size of the radial gradient
 * @property {boolean} [breathing=true] - Enables or disables breathing animation
 * @property {string[]} [gradientColors] - Array of colors for radial gradient
 * @property {number[]} [gradientStops] - Array of percentage stops for colors
 * @property {number} [animationSpeed=0.01] - Speed of breathing animation
 * @property {number} [breathingRange=3] - Range for breathing animation
 * @property {Object} [containerStyle={}] - Additional inline styles
 * @property {string} [containerClassName=""] - Additional class names
 * @property {number} [topOffset=0] - Additional top offset for gradient
 * @property {React.ReactNode} [children] - Children to render on top
 */

/**
 * Animated gradient background with interactive effects
 * @param {AnimatedGradientBackgroundProps} props
 */
const AnimatedGradientBackground = ({
  startingGap = 125,
  breathing = true,
  gradientColors = [
    "#050505",  // Darker starting color
    "#0F1754",  // Darker blue
    "#072571",  // Darker navy
    "#0A4B98",  // Darker royal blue
    "#015D93",  // Darker medium blue
    "#00474C",  // Darker teal
    "#003329"   // Darker green
  ],
  gradientStops = [35, 50, 60, 70, 80, 90, 100],
  animationSpeed = 0.01,
  breathingRange = 3,
  containerStyle = {},
  topOffset = 0,
  containerClassName = "",
  children
}) => {
  // Validation: Ensure gradientStops and gradientColors lengths match
  if (gradientColors.length !== gradientStops.length) {
    throw new Error(
      `GradientColors and GradientStops must have the same length.
     Received gradientColors length: ${gradientColors.length},
     gradientStops length: ${gradientStops.length}`
    );
  }

  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrame;
    let width = startingGap;
    let directionWidth = 1;

    const animateGradient = () => {
      if (width >= startingGap + breathingRange) directionWidth = -1;
      if (width <= startingGap - breathingRange) directionWidth = 1;

      if (!breathing) directionWidth = 0;
      width += directionWidth * animationSpeed;

      const gradientStopsString = gradientStops
        .map((stop, index) => `${gradientColors[index]} ${stop}%`)
        .join(", ");

      const gradient = `radial-gradient(${width}% ${width+topOffset}% at 50% 20%, ${gradientStopsString})`;

      if (containerRef.current) {
        containerRef.current.style.background = gradient;
      }

      animationFrame = requestAnimationFrame(animateGradient);
    };

    animationFrame = requestAnimationFrame(animateGradient);

    return () => cancelAnimationFrame(animationFrame); // Cleanup animation
  }, [startingGap, breathing, gradientColors, gradientStops, animationSpeed, breathingRange, topOffset]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#050505]">
      <motion.div
        key="animated-gradient-background"
        initial={{
          opacity: 0,
          scale: 1.5,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 2,
            ease: [0.25, 0.1, 0.25, 1], // Cubic bezier easing
          },
        }}
        className={`fixed inset-0 overflow-hidden ${containerClassName}`}
      >
        <div
          ref={containerRef}
          style={containerStyle}
          className="absolute inset-0 transition-transform"
        />
      </motion.div>
      
      {/* Grid overlay for texture */}
      <motion.div
        className="fixed inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 40,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <div className="h-full w-full [background-image:repeating-linear-gradient(100deg,#64748B_0%,#64748B_1px,transparent_1px,transparent_4%)] opacity-10" />
      </motion.div>
      
      {/* Content container */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default AnimatedGradientBackground; 