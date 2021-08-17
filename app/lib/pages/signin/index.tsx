import React from "react";
import styled from "@emotion/styled";
function Signin() {
  return (
    <RootWrapperSignin>
      <MdiArrowBack>
        <Vector>
          <Vector_0001></Vector_0001>
        </Vector>
      </MdiArrowBack>
      <Frame144>
        <Frame142>
          <Frame141>
            <Name>Sign in to Grida</Name>
            <Name_0001>
              For automatic image hosting, sharing code and much more.
            </Name_0001>
          </Frame141>
        </Frame142>
        <Frame143>
          <Button>
            <Label>Sign in</Label>
          </Button>
          <Button_0001>
            <Label_0001>Sign up</Label_0001>
          </Button_0001>
        </Frame143>
      </Frame144>
    </RootWrapperSignin>
  );
}
const RootWrapperSignin = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;
const MdiArrowBack = styled.div`
  display: flex;
  flex-direction: row;
`;
const Vector = styled.div`
  display: flex;
  flex-direction: row;
`;
const Vector_0001 = styled.div``;
const Frame144 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;
const Frame142 = styled.div`
  display: flex;
  flex-direction: row;
`;
const Frame141 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;
const Name = styled.span`
  color: rgba(0, 0, 0, 1);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Helvetica Neue;
  font-weight: 500;
  text-align: left;
  min-height: 29px;
  width: 172px;
`;
const Name_0001 = styled.span`
  color: rgba(141, 141, 141, 1);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Helvetica Neue;
  font-weight: 400;
  text-align: left;
  min-height: 34px;
  width: 214px;
`;
const Frame143 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;
const Button = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 16px;
  padding-top: 16px;
  padding-left: 36px;
  padding-right: 36px;
`;
const Label = styled.span`
  color: rgba(1, 1, 1, 1);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Helvetica Neue;
  font-weight: 700;
  text-align: left;
  min-height: 17px;
  width: 46px;
`;
const Button_0001 = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 16px;
  padding-top: 16px;
  padding-left: 36px;
  padding-right: 36px;
`;
const Label_0001 = styled.span`
  color: rgba(21, 22, 23, 1);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Helvetica Neue;
  font-weight: 700;
  text-align: left;
  min-height: 17px;
  width: 51px;
`;
export default Signin;
