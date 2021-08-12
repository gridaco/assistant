import React from "react";
import styled from "@emotion/styled";
import {
  BlackButton,
  ButtonStyle,
  TransparencyButton,
} from "../../components/style/global-style";
import { Button } from "@material-ui/core";
import { ProgressBar } from "../../components/progress-bar";

const step = [
  "converting design to universal format",
  "analyzing the layout",
  "detecting components",
  "checking existing components",
  "making builds (flutter, react, ..)",
  "running tests",
];

export function UploadSteps() {
  return (
    <>
      <ProgressBar />
      <InnerWrapper>
        <Loading>
          <Title>
            Uploading your design
            <br />
            “button”
          </Title>
          <StepsWrapper>
            {step.map((item) => (
              <Field>
                <Icon></Icon>
                <Item>{item}</Item>
              </Field>
            ))}
          </StepsWrapper>
        </Loading>
        <Finish>
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
      </InnerWrapper>
    </>
  );
}

const InnerWrapper = styled.div`
  padding: 12px;
  padding-top: 72px;

  // TODO: contorl stateus!
  /* display: none; */
`;

const Loading = styled.div`
  display: none;
`;

const Finish = styled.div``;

const Title = styled.h1`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: #4a4a4a;
  margin: 0;
`;

const StepsWrapper = styled.div`
  margin-top: 16px;
`;

const Field = styled.div`
  display: flex;
  margin-bottom: 9px;

  &:last-child() {
    margin-bottom: 0;
  }
`;
const Icon = styled.div`
  width: 16px;
  height: 16px;
  line-height: 19px;
  background: wheat;
  margin-right: 9px;
`;

const Item = styled.h5`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: #8b8b8b;
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
