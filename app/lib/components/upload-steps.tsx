import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  BlackButtonStyle,
  TransparentButtonStyle,
} from "@ui/core/button-style";
import { Button } from "@material-ui/core";
import { ProgressBar } from "./animation/progress-bar";
import { AnimatedCheckIcon } from "./animation/animated-check-icon";
import { motion } from "framer-motion";
import { Preview } from "@ui/previewer";
import CheckIcon from "@assistant/icons/check";

const step = [
  "converting design to universal format",
  "analyzing the layout",
  "detecting components",
  "checking existing components",
  "making builds (flutter, react, ..)",
  "running tests",
];

const fieldVariants = {
  "make-active": {
    transition: { staggerChildren: 0.8, delayChildren: 1 },
  },
};

const itemVariants = {
  "make-active": {
    color: "#8B8B8B",
    transition: { ease: "easeIn", duration: 0.2 },
  },
};

export function UploadSteps() {
  const [isLoading, setIsLoading] = useState(true);

  function animateHandle() {
    setIsLoading(!isLoading);
  }

  return (
    <>
      <Preview auto />
      {isLoading && <ProgressBar contorl={animateHandle} />}
      <InnerWrapper variants={fieldVariants} animate="make-active">
        {isLoading ? (
          <Loading>
            <Title>
              Uploading your design
              <br />
              “button”
            </Title>
            <StepsWrapper variants={fieldVariants} animate="make-active">
              {step.map((item, i) => (
                <Field key={`Upload-Step-${item}-${i}`} variants={itemVariants}>
                  <Icon />
                  <Item variants={itemVariants} initial={{ color: "#C1C1C1" }}>
                    {item}
                  </Item>
                </Field>
              ))}
            </StepsWrapper>
          </Loading>
        ) : (
          <>
            <Finish>
              <Field>
                <IconBox>
                  <CheckIcon />
                </IconBox>

                <Title>Your design is ready</Title>
              </Field>
              <Item>
                You can start using this component in your existing project
                immideitly.
              </Item>
              <FooterButtonWrapper>
                <CheckButton>Check it out</CheckButton>
                <UncheckButton>do it later</UncheckButton>
              </FooterButtonWrapper>
            </Finish>
          </>
        )}
      </InnerWrapper>
    </>
  );
}

const InnerWrapper = styled(motion.div)`
  padding: 12px;
  padding-top: 72px;

  // TODO: contorl stateus!
  /* display: none; */
`;

const Loading = styled.div`
  /* display: none; */
`;

const Finish = styled.div`
  /* display: none; */
`;

const Title = styled.h1`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: #4a4a4a;
  margin: 0;
`;

const StepsWrapper = styled(motion.div)`
  margin-top: 16px;
`;

const Field = styled(motion.div)`
  display: flex;
  margin-bottom: 9px;

  &:last-child() {
    margin-bottom: 0;
  }
`;
const Icon = styled(AnimatedCheckIcon)`
  margin-right: 9px;
`;

const Item = styled(motion.h5)`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;

  margin: 0;
  vertical-align: middle;
`;

const FooterButtonWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  width: calc(100% - 40px);
`;
const IconBox = styled.div`
  fill: #6cd470;
  margin-right: 9px;
`;

const CheckButton = styled(Button)`
  ${BlackButtonStyle};
  width: 100%;
`;
const UncheckButton = styled(Button)`
  ${TransparentButtonStyle}
  width: 100%;
  cursor: pointer;
  text-transform: initial;
`;
