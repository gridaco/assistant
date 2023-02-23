import React from "react";
import styled from "@emotion/styled";

import { AnimatePresence, motion } from "framer-motion";

interface IProgressBar {
  initial?: number;
  height?: React.CSSProperties["height"];
  onAnimationComplete?: () => void;
}

export function AnimatedProgressBar({
  initial = 10,
  height = 4,
  onAnimationComplete,
}: IProgressBar) {
  return (
    <Base>
      {/* @ts-ignore */}
      <AnimatePresence>
        <Bar
          style={{
            height,
          }}
          initial={{ width: `${initial}%` }}
          animate={{ width: "100%" }}
          transition={{
            ease: "easeOut",
            duration: 5,
          }}
          onAnimationComplete={onAnimationComplete}
        />
      </AnimatePresence>
    </Base>
  );
}

const Base = styled.div`
  background: #f5f5f5;
`;

const Bar = styled(motion.div)`
  background: #2562ff;
`;
