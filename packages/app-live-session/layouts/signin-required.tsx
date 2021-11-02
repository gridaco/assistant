import React from "react";
import styled from "@emotion/styled";
import { Dialog } from "@material-ui/core";
import { SigninScreen } from "@app/auth";

export function SigninRequiredLayout({ onSignin }: { onSignin: () => void }) {
  const [open, setOpen] = React.useState(false);

  const startAuthProc = () => {
    setOpen(true);
  };

  return (
    <>
      <RootWrapperBody>
        <Contents>
          <TitleAndDesc>
            <SigninToContinue>Sign in to continue</SigninToContinue>
            <Description>
              You need to Sign up / Sign to use Assistant live session
            </Description>
          </TitleAndDesc>
          <Button onClick={startAuthProc}>
            <Label>Sign in</Label>
          </Button>
        </Contents>
      </RootWrapperBody>
      {
        <Dialog open={open} fullScreen>
          <SigninScreen
            onSignin={onSignin}
            onClose={() => {
              setOpen(false);
            }}
          />
        </Dialog>
      }
    </>
  );
}

const RootWrapperBody = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 12px;
  box-sizing: border-box;
  padding: 120px 120px;
`;

const Contents = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 36px;
  width: 289px;
  height: 155px;
  box-sizing: border-box;
  padding: 10px 10px;
`;

const TitleAndDesc = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 12px;
  width: 269px;
  height: 51px;
  box-sizing: border-box;
`;

const SigninToContinue = styled.span`
  color: rgba(0, 0, 0, 1);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Helvetica, sans-serif;
  font-weight: 400;
  text-align: center;
`;

const Description = styled.span`
  color: rgba(149, 149, 149, 1);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Helvetica, sans-serif;
  font-weight: 400;
  text-align: center;
  width: 269px;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  border-radius: 4px;
  height: 48px;
  background-color: rgba(21, 22, 23, 1);
  box-sizing: border-box;
  padding: 14px 36px;
`;

const Label = styled.span`
  color: rgba(255, 255, 255, 1);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 700;
  text-align: left;
`;
