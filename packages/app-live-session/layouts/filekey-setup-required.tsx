import React from "react";
import styled from "@emotion/styled";
import {
  FigmaFileChecksum,
  saveFilekey,
} from "@platform-dedicated/figma-checksum";
import { Dialog } from "@material-ui/core";

export function FilekeySetupRequiredLayout({
  onKeySetup,
}: {
  onKeySetup: (key: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const startChecksumProcess = () => {
    setOpen(true);
  };

  return (
    <>
      <RootWrapperBody>
        <Contents>
          <TitleAndDesc>
            <GrantAccessToThisFile>
              Grant access to this file
            </GrantAccessToThisFile>
            <AllowUsToAccessThisFile>
              Allow us to access this file.
            </AllowUsToAccessThisFile>
          </TitleAndDesc>
          <Button onClick={startChecksumProcess}>
            <Label>Next</Label>
          </Button>
        </Contents>
      </RootWrapperBody>
      {
        <Dialog open={open} fullScreen>
          <FigmaFileChecksum
            mode="only-url-scheme"
            onVerify={(valid, filekey) => {
              if (valid) {
                // save filekey
                saveFilekey(filekey)
                  .then(() => {
                    onKeySetup(filekey);
                  })
                  .finally(() => {
                    // close dialog
                    setOpen(false);
                  });
              } else {
                // this can't happen on `"only-url-scheme"`
                // show error
                // close dialog
                setOpen(false);
              }
            }}
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

const GrantAccessToThisFile = styled.span`
  color: rgba(0, 0, 0, 1);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Helvetica, sans-serif;
  font-weight: 400;
  text-align: center;
`;

const AllowUsToAccessThisFile = styled.span`
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
  width: 108px;
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
