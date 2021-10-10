import React from "react";
import { motion } from "framer-motion";
import { smooth_damping_hide_motion_transition } from "../motions";

export function AppbarContainerMotion({
  hidden,
  children,
}: {
  hidden: boolean;
  children: JSX.Element | JSX.Element[];
}) {
  /** add this const **/
  const variants_for_container = {
    visible: { opacity: 1 },
    hidden: { opacity: 0, height: 0 },
  };

  return (
    <motion.div
      variants={variants_for_container}
      animate={hidden ? "hidden" : "visible"}
      style={{
        zIndex: 1,
      }}
      transition={smooth_damping_hide_motion_transition}
    >
      {children}
    </motion.div>
  );
}

export function AppbarContentMotion({
  hidden,
  children,
}: {
  hidden: boolean;
  children: JSX.Element | JSX.Element[];
}) {
  const variants_for_child = {
    visible: { y: 0 },
    hidden: { y: -100 },
  };

  return (
    <motion.div
      variants={variants_for_child}
      animate={hidden ? "hidden" : "visible"}
      transition={smooth_damping_hide_motion_transition}
    >
      {children}
    </motion.div>
  );
}
