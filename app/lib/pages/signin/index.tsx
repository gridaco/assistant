import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  startAuthenticationWithSession,
  startAuthenticationSession,
} from "../../auth";
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
import { AuthProxySessionStartResult } from "@base-sdk-fp/auth";
import { PluginSdk } from "@plugin-sdk/app";

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

function InitialStateContent() {
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

function LoadingContents(props: { authUrl: string; onCheckAuth: () => void }) {
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
          👉 Let me in, I’ve completed all steps on the browser.
        </LinkContents>
        <LinkContents href={props.authUrl} target="_blank">
          👉 Open the sign-in page again
        </LinkContents>
      </LinkWrapper>
    </>
  );
}

function FinishCheckingAuth(props: { username: string }) {
  return (
    <>
      <Title>
        Welcome <br />
        {`${props.username} :)`}
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
  const [sessionInfo, setSessionInfo] = useState<AuthProxySessionStartResult>();
  const history = useHistory();

  return (
    <Wrapper>
      <BackIcon onClick={() => history.goBack()}>
        <LeftArrow />
      </BackIcon>
      <Inner>
        {!isAuthToken ? (
          !isLoading ? (
            <InitialStateContent />
          ) : (
            <LoadingContents
              authUrl={sessionInfo?.authUrl}
              onCheckAuth={() => {}}
            /> // TODO: provide callback state check & browser url.
          )
        ) : (
          <FinishCheckingAuth username="Universe" /> // TODO: change with authenticated user name
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
                  setIsLoading(true);
                  startAuthenticationSession()
                    .then((s) => {
                      open(s.authUrl); // open browser initially.
                      setSessionInfo(s);
                      startAuthenticationWithSession(s);
                    })
                    .catch((_) => {
                      PluginSdk.notify(
                        "please try again. (check your internet connection)"
                      );
                      setIsLoading(true);
                    });
                }}
              >
                {!isLoading ? "Sign in" : "Sign in ..."}
              </SignInBtn>
              <SignUpBtn
                onClick={() => {
                  open("https://accounts.grida.co/signup");
                  // clear states
                  setIsLoading(false);
                }}
              >
                Sign Up
              </SignUpBtn>
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
