import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { startAuthentication } from "../../auth";
import {
  BlackButton,
  ButtonStyle,
  Column,
  WhtieButton,
} from "../../components/style/global-style";
import { useHistory } from "react-router";
import {
  BackIcon,
  BtnWrapper,
  Contents,
  Inner,
  LinkContents,
  LinkWrapper,
  SignInBtn,
  SignUpBtn,
  Title,
  Wrapper,
} from "./style";

// onClick={() => {
//   startAuthentication();
// }}

function LeftArrow() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
        fill="black"
      />
    </svg>
  );
}

function InitContents() {
  return (
    <>
      <Title>Sign in to Grida</Title>
      <Contents>
        For automatic image hosting,
        <br />
        sharing code and much more.
      </Contents>
    </>
  );
}

function LoadingContents() {
  return (
    <>
      <Title>
        Complete your
        <br />
        steps on browser
      </Title>
      <Contents>
        Complete sign-in on your browser, if it still
        <br />
        doesn’t work after you sign-in, Press the
        <br />
        link below.
      </Contents>
      <LinkWrapper>
        <LinkContents>
          👉 Let me in, I’ve completed all steps on the
          <br />
          browser.
        </LinkContents>
        <LinkContents>👉 Open the sign-in page again</LinkContents>
      </LinkWrapper>
    </>
  );
}

function FinishCheckingAuth(userName: string) {
  return (
    <>
      <Title>
        Welcome <br />
        {`${userName} :)`}
      </Title>
      <Contents>
        Ready to build world-shaking
        <br />
        products with us?
      </Contents>
    </>
  );
}

function Signin() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthToken, setIsAuthToken] = useState<boolean>(false);
  const history = useHistory();

  return (
    <Wrapper>
      <BackIcon onClick={() => history.goBack()}>
        <LeftArrow />
      </BackIcon>
      <Inner>
        {!isAuthToken ? (
          !isLoading ? (
            InitContents()
          ) : (
            LoadingContents()
          )
        ) : (
          <>{FinishCheckingAuth("Universe")}</>
        )}
        <BtnWrapper>
          {isAuthToken ? (
            <>
              <StyledButton>Aaaallll Right !</StyledButton>
            </>
          ) : (
            <>
              <SignInBtn
                disabled={isLoading}
                onClick={() => {
                  startAuthentication();
                  setIsLoading(true);
                }}
              >
                {!isLoading ? "Sign in" : "Sign in ..."}
              </SignInBtn>
              <SignUpBtn>Sign Up</SignUpBtn>
            </>
          )}
        </BtnWrapper>
      </Inner>
    </Wrapper>
  );
}

const StyledButton = styled.button`
  ${ButtonStyle}
  width: calc(100vw - 54px);
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
  background: #2562ff;
  margin-bottom: 53px;
`;

export default Signin;
