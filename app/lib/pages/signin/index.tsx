import React from "react";
import styled from "@emotion/styled";
import { startAuthentication } from "../../auth";

// onClick={() => {
//   startAuthentication();
// }}

function Signin() {
  return (
    <Wrapper>
      <BackIcon />
      <Title>Sign in to Grida</Title>
      <Contents>
        For automatic image hosting,
        <br />
        sharing code and much more.
      </Contents>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 25px 21px;
`;

const BackIcon = styled.div`
  width: 24px;
  height: 24px;
  background: red;
  cursor: pointer;
`;

const Title = styled.h2`
  margin: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;

  color: #000000;
`;
const Contents = styled.h6`
  margin: 0;
  margin-top: 8px;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #8d8d8d;
`;
export default Signin;
