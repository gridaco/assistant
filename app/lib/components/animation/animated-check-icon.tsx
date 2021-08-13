import React from "react";
import styled from "@emotion/styled";

import { motion } from "framer-motion";

const variants = {
  "make-active": {
    opacity: 1,
    scale: 1.05,
    fill: "#6CD470",
    transition: { ease: "easeOut", duration: 0.2 },
  },
};

export function AnimatedCheckIcon() {
  return (
    <CheckIcon
      style={{
        marginRight: "9px",
      }}
      variants={variants}
      initial={{ fill: "#C1C1C1" }}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM7.29 14.29L3.7 10.7C3.31 10.31 3.31 9.68 3.7 9.29C4.09 8.9 4.72 8.9 5.11 9.29L8 12.17L14.88 5.29C15.27 4.9 15.9 4.9 16.29 5.29C16.68 5.68 16.68 6.31 16.29 6.7L8.7 14.29C8.32 14.68 7.68 14.68 7.29 14.29Z" />
    </CheckIcon>
  );
}

const CheckIcon = styled(motion.svg)``;
