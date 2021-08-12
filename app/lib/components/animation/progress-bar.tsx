import React from "react";
import styled from "@emotion/styled";

import { AnimatePresence, motion } from "framer-motion";

export function ProgressBar() {
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
        />
      </AnimatePresence>
    </Background>
  );
}

const Background = styled.div`
  background: #f5f5f5;

  // for reset body padding
  margin-left: -8px;
  margin-right: -8px;
`;

const Bar = styled(motion.div)`
  height: 8px;
  background: #6cd470;
`;
