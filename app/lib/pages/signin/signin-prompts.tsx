import React from "react";
import styled from "@emotion/styled";
import { BlackButton, WhtieButton } from "../../components/style/global-style";
import { useHistory } from "react-router";
import { startAuthentication } from "../../auth";
import {
  BackIcon,
  BtnWrapper,
  Contents,
  Inner,
  LinkContents,
  SignInBtn,
  SignUpBtn,
  Title,
  Wrapper,
} from "./style";

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

function SigninPrompts() {
  const history = useHistory();

  return (
    <Wrapper>
      <BackIcon onClick={() => history.goBack()}>
        <LeftArrow />
      </BackIcon>
      <Inner>
        <Title>
          Sign-in required.
          <br />
          (Don’t worry It’s Free.)
        </Title>
        <Contents>
          You’ve reached the first 30 code-gen uses. For
          <br />
          further usage, <b>sign up &amp; sign in is required.</b>
          <br />
          Please continue using Grida Assistant after
          <br />
          signing-in {`:)`}
        </Contents>
        <LinkContents>Oh. Don’t worry, It’s all Free.</LinkContents>
        <BtnWrapper>
          <SignInBtn
            onClick={() => {
              startAuthentication();
              // setIsLoading(true);
            }}
          >
            Sign in
          </SignInBtn>
          <SignUpBtn>Sign Up</SignUpBtn>
        </BtnWrapper>
      </Inner>
    </Wrapper>
  );
}

export default SigninPrompts;
