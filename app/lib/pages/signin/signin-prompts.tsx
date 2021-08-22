import React from "react";
import styled from "@emotion/styled";
import { BlackButton, WhtieButton } from "../../components/style/global-style";
import { useHistory } from "react-router";
import { startAuthentication } from "../../auth";
import BackArrowIcon from "@assistant/icons/back-arrow";
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

function SigninPrompts() {
  const history = useHistory();

  return (
    <Wrapper>
      <BackIcon onClick={() => history.goBack()}>
        <BackArrowIcon />
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
