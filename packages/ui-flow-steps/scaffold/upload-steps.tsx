import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  BlackButtonStyle,
  TransparentButtonStyle,
} from "@ui/core/button-style";
import { Button } from "@material-ui/core";
import { motion } from "framer-motion";
import { Preview } from "@ui/previewer";
import CheckIcon from "@assistant/icons/check";
import { AnimatedProgressBar, AnimatedCheckIcon } from "../components";

const steps = [
  "converting design to universal format",
  "analyzing the layout",
  "detecting components",
  "checking existing components",
  "making builds (flutter, react, ..)",
  "running tests",
];

const _motion_field_variants = {
  "make-active": {
    transition: { staggerChildren: 0.8, delayChildren: 1 },
  },
};

const _motion_item_variants = {
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
      <Preview type="static" auto />
      {isLoading && <AnimatedProgressBar contorl={animateHandle} />}
      <InnerWrapper variants={_motion_field_variants} animate="make-active">
        {isLoading ? (
          <Loading>
            <Title>
              Uploading your design
              <br />
              “button”
            </Title>
            <StepsWrapper
              variants={_motion_field_variants}
              animate="make-active"
            >
              {steps.map((item, i) => (
                <Field
                  key={`Upload-Step-${item}-${i}`}
                  variants={_motion_item_variants}
                >
                  <Icon />
                  <Item
                    variants={_motion_item_variants}
                    initial={{ color: "#C1C1C1" }}
                  >
                    {item}
                  </Item>
                </Field>
              ))}
            </StepsWrapper>
          </Loading>
        ) : (
          <>
            <Finished>
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
            </Finished>
          </>
        )}
      </InnerWrapper>
    </>
  );
}

const InnerWrapper = styled(motion.div)`
  padding: 12px;
  padding-top: 72px;
`;

const Loading = styled.div`
  /* display: none; */
`;

const Finished = styled.div`
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
  bottom: 16px;
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
