import React from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

/**
 * A general component that can be used to animate a component when it is visible.
 * @returns
 */
export function RevealWhenVisible({
  children,
  initialY = 0,
  initialOpacity = 0,
  duration = 0.5,
}: {
  children: React.ReactNode;
  initialY?: number;
  initialOpacity?: number;
  duration?: number;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "-100px 0px",
  });

  const variants = {
    visible: {
      y: 0,
      opacity: 1,
    },
    hidden: {
      y: initialY,
      opacity: initialOpacity,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      variants={variants}
      animate={inView ? "visible" : "hidden"}
      transition={{
        duration: duration,
      }}
    >
      {children}
    </motion.div>
  );
}
