import React from "react";
import styled from "@emotion/styled";

import { motion } from "framer-motion";
import CheckIcon from "@assistant/icons/check";

const variants = {
  "make-active": {
    opacity: 1,
    scale: 1.05,
    fill: "#2562FF",
    transition: { ease: "easeOut", duration: 0.2 },
  },
};

export function AnimatedCheckIcon() {
  return (
    <StyledCheckIcon
      style={{
        marginRight: "9px",
      }}
      variants={variants}
      initial={{ fill: "#C1C1C1" }}
    >
      <CheckIcon />
    </StyledCheckIcon>
  );
}

const StyledCheckIcon = styled(motion.div)``;
