import React from "react";
import styled from "@emotion/styled";
import { BlackButtonStyle, WhtieButtonStyle } from "@ui/core/button-style";
import { Column } from "@ui/core";

export const Wrapper = styled.div`
  // 66 is body margin 8*2, wrapper padding 25*2
  height: calc(100vh - 66px);

  padding: 25px 21px;
`;

export const BackIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export const Inner = styled.div`
  margin-top: 60px;

  @media (min-height: 800px) {
    margin-top: 120px;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #000000;
`;

export const BtnWrapper = styled.div`
  /* margin-top: 391px; */
  position: absolute;
  bottom: 60px;

  @media (min-height: 800px) {
    bottom: 120px;
  }
`;

export const SignInBtn = styled.button`
  ${BlackButtonStyle}
  width: calc(100vw - 54px);
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
`;

export const SignUpBtn = styled.button`
  ${WhtieButtonStyle}
  width: calc(100vw - 54px);
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #151617;
  border: 0;
`;

export const Contents = styled.h6`
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

export const LinkWrapper = styled(Column)`
  margin-top: 45px;
  @media (min-height: 800px) {
    margin-top: 90px;
  }
`;

export const LinkContents = styled.a`
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  text-decoration-line: underline;
  cursor: pointer;

  color: #8d8d8d;

  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;
