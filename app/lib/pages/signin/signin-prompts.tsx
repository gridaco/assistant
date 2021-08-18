import React from "react";
import styled from "@emotion/styled";
import { BlackButton, WhtieButton } from "../../components/style/global-style";
import { useHistory } from "react-router";
import { startAuthentication } from "../../auth";

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

const Wrapper = styled.div`
  // 66 is body margin 8*2, wrapper padding 25*2
  height: calc(100vh - 66px);

  padding: 25px 21px;
`;

const BackIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Inner = styled.div`
  margin-top: 120px;
`;

const Title = styled.h2`
  margin: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #000000;
`;

const BtnWrapper = styled.div`
  margin-top: 391px;
  position: absolute;
  bottom: 120px;
`;

const Contents = styled.h6`
  margin: 0;
  margin-top: 8px;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  b {
    font-weight: 700;
  }

  color: #8d8d8d;
`;

const LinkContents = styled.a`
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  text-decoration-line: underline;
  cursor: pointer;

  color: #8d8d8d;
  margin-top: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SignInBtn = styled.button`
  ${BlackButton}
  width: calc(100vw - 54px);
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
`;

const SignUpBtn = styled.button`
  ${WhtieButton}
  width: calc(100vw - 54px);
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #151617;
  border: 0;
`;

export default SigninPrompts;
