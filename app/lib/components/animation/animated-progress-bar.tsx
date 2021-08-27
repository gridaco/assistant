import React from "react";
import styled from "@emotion/styled";

import { AnimatePresence, motion } from "framer-motion";

interface IProgressBar {
  contorl?: () => void;
}

export function AnimatedProgressBar(props: IProgressBar) {
  return (
    <Background>
      <AnimatePresence>
        <Bar
          initial={{ width: "0" }}
          animate={{ width: "100%" }}
          transition={{
            ease: "easeOut",
            duration: 10,
            delay: 2,
          }}
          onAnimationComplete={props.contorl}
        />
      </AnimatePresence>
    </Background>
  );
}

const Background = styled.div`
  background: #f5f5f5;

  // for reset body and parent padding
  margin-left: -20px;
  margin-right: -20px;
`;

const Bar = styled(motion.div)`
  height: 8px;
  background: #6cd470;
`;
