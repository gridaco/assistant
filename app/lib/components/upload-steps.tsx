import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { BlackButton, TransparencyButton } from "./style/global-style";
import { Button } from "@material-ui/core";
import { ProgressBar } from "./animation/progress-bar";
import { AnimatedCheckIcon } from "./animation/animated-check-icon";
import { motion } from "framer-motion";
import { Preview } from ".";

const step = [
  "converting design to universal format",
  "analyzing the layout",
  "detecting components",
  "checking existing components",
  "making builds (flutter, react, ..)",
  "running tests",
];

const loadingVariants = {
  "make-active": {
    // display: "none",
    // opacity: 1,
    // transitionEnd: {
    //   display: "none",
    // },
    transition: { duration: 1 },
  },
};

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

const finishVariants = {
  "make-active": {
    display: "none",
    transition: { display: "block" },
  },
};

export function UploadSteps() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);
  return (
    <>
      <Preview auto />
      <InnerWrapper variants={fieldVariants} animate="make-active">
        {isLoading ? (
          <Loading variants={loadingVariants} animate="make-active">
            <ProgressBar />
            <Title>
              Uploading your design
              <br />
              “button”
            </Title>
            <StepsWrapper
              variants={fieldVariants}
              animate="make-active"
              onTransitionEnd={() => {
                setIsLoading(!isLoading);
              }}
            >
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
            <Finish variants={finishVariants} initial={{ display: "none" }}>
              <Field>
                <Icon></Icon>
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

const Loading = styled(motion.div)`
  /* display: none; */
`;

const Finish = styled(motion.div)`
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
  /* width: 16px;
  height: 16px;
  line-height: 19px; */
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

const CheckButton = styled(Button)`
  ${BlackButton};
  width: 100%;
`;
const UncheckButton = styled(Button)`
  ${TransparencyButton}
  width: 100%;
  cursor: pointer;
  text-transform: initial;
`;
