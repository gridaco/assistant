import React from "react";
import styled from "@emotion/styled";
import { useHistory } from "react-router";
import { startAuthentication } from "@assistant-fp/auth";
import BackArrowIcon from "@assistant/icons/back-arrow";
import {
  BtnWrapper,
  Contents,
  Inner,
  LinkContents,
  SignInBtn,
  SignUpBtn,
  Title,
  ContentWrap,
} from "./style";

function SigninPrompts() {
  const history = useHistory();

  return (
    <>
      <ContentWrap>
        <Inner>
          <BackIcon onClick={() => history.goBack()}>
            <BackArrowIcon />
          </BackIcon>
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
        </Inner>
      </ContentWrap>
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
    </>
  );
}

const BackIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export default SigninPrompts;
