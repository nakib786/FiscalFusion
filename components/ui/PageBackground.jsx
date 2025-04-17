"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * A dark background wrapper for the entire page
 */
function PageBackground({ children }) {
  return (
    <div className="relative w-full min-h-screen bg-[#050505] overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[50%] h-[40%] left-[25%] top-[15%] rounded-full opacity-20 blur-[100px]"
          style={{ background: "linear-gradient(180deg, #0F1754 0%, #072571 100%)" }}
          animate={{
            x: [0, 10, -10, 0],
            y: [0, -10, 10, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[35%] h-[30%] left-[55%] top-[50%] rounded-full opacity-20 blur-[100px]"
          style={{ background: "linear-gradient(180deg, #015D93 0%, #00474C 100%)" }}
          animate={{
            x: [0, -15, 15, 0],
            y: [0, 15, -15, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[40%] h-[35%] left-[10%] top-[60%] rounded-full opacity-20 blur-[100px]"
          style={{ background: "linear-gradient(180deg, #0A4B98 0%, #003329 100%)" }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid overlay for texture */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[url('/grid-pattern.svg')] opacity-5" />
      </div>

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_80%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default PageBackground; 