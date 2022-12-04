import React from "react";
import styled from "@emotion/styled";
import { LinkInput } from "../components";
import { FigmaRootNodeStoreVerification } from "@design-sdk/figma-checksum";
import { fromApp } from "../__plugin/events";
import { nanoid } from "nanoid/non-secure";
import { isAuthenticated } from "@assistant-fp/auth";
import BackArrowIcon from "@assistant/icons/back-arrow";
import CaretDownIcon from "@assistant/icons/caret-down";

type VerificationMode = "only-url-scheme" | "figma-node-store-verification";

/**
 * ![](https://www.figma.com/file/4hqwYFw6FKw1njvzEl3VUh/assistant?node-id=4473%3A37403)
 * @returns
 */
export function FigmaFileChecksum({
  onClose,
  mode = "only-url-scheme",
  onVerify,
}: {
  onClose: () => void;
  mode?: VerificationMode;
  onVerify: (valid: boolean, filekey?: string) => void;
}) {
  const signature = nanoid();

  const startVerification = async ({ filekey }: { filekey: string }) => {
    switch (mode) {
      case "only-url-scheme": {
        // the url scheme is already validated by previous step, we can skip to final callback.
        onVerify(true, filekey);
        return;
      }
      case "figma-node-store-verification": {
        // 1. seed the signature to design
        fromApp({
          type: "seed-signature-request",
          filekey,
          signature,
        });

        // 2. check if app assistant is authenticated
        if (await isAuthenticated()) {
          //
        }
        // TODO:
        // 3. check if assistant contains figma access key authenticated by user
        // TODO:
        // 4. validate figma file checksum
        const verified = await new FigmaRootNodeStoreVerification({
          signature,
          filekey,
        }).verify();
        if (verified) {
          //
          // TODO:
        } else {
          //
          // TODO:
        }
        return;
      }
    }
  };

  return (
    <RootWrapperFigmaFileChecksum>
      <BackButton onClick={onClose}>
        <BackArrowIcon />
      </BackButton>
      <ContentBody>
        <Header>
          <Title>Allow us to access this file.</Title>
          <Desc>Copy & Paste the link to this current file.</Desc>
        </Header>
        <Spacer></Spacer>
        <InputSection>
          <LinkInput
            onValidLink={(filekey) => {
              startVerification({ filekey });
            }}
          />
        </InputSection>
        <Spacer_0001></Spacer_0001>
        <HowToArea>
          <ScrollDownIndication>
            <HowToGetTheLink>How to get the link</HowToGetTheLink>
            <CaretDownIcon />
          </ScrollDownIndication>
          <GraphicsAndDescription>
            <FigmaDesktopWhereIsShareButtonArtwork
              src={
                "/assets/images/artwork-figma-desktop-where-is-share-button.png"
              }
              alt="image of FigmaDesktopWhereIsShareButtonArtwork"
            ></FigmaDesktopWhereIsShareButtonArtwork>
            <Description>
              <Content>
                On browser, simply copy-paste the current link. On Figma desktop
                app, click <b>Share - Copy link</b>, paste the copied link. (You
                don’t need to change sharing options)
              </Content>
            </Description>
          </GraphicsAndDescription>
        </HowToArea>
      </ContentBody>
    </RootWrapperFigmaFileChecksum>
  );
}

const RootWrapperFigmaFileChecksum = styled.div`
  min-height: 100vh;
  background-color: rgba(255, 255, 255, 1);
  position: relative;
`;

const BackButton = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 21px;
  top: 25px;
`;

const ContentBody = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: start;
  flex: none;
  gap: 0;
  height: 895px;
  box-sizing: border-box;
  position: absolute;
  left: 0px;
  top: 80px;
  right: 1px;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: start;
  flex: 1;
  gap: 8px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 21px 21px;
`;

const Title = styled.span`
  color: rgba(0, 0, 0, 1);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  text-align: left;
  align-self: stretch;
`;

const Desc = styled.span`
  color: rgba(141, 141, 141, 1);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
  width: 372px;
`;

const Spacer = styled.div`
  height: 40px;
  align-self: stretch;
`;

const InputSection = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: start;
  flex: 1;
  gap: 10px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 32px 32px;
`;

const Spacer_0001 = styled.div`
  height: 160px;
  align-self: stretch;
`;

const HowToArea = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 30px;
  align-self: stretch;
  box-sizing: border-box;
`;

const ScrollDownIndication = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 2px;
  width: 127px;
  height: 24px;
  box-sizing: border-box;
`;

const HowToGetTheLink = styled.span`
  color: rgba(132, 132, 132, 1);
  text-overflow: ellipsis;
  font-size: 12px;
  font-family: Roboto, sans-serif;
  font-weight: 500;
  text-align: left;
`;

const GraphicsAndDescription = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: start;
  flex: 1;
  gap: 0;
  align-self: stretch;
  box-sizing: border-box;
`;

const FigmaDesktopWhereIsShareButtonArtwork = styled.img`
  height: 295px;
  object-fit: cover;
  object-position: top right;
  align-self: stretch;
`;

const Description = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: start;
  flex: 1;
  gap: 10px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 21px 21px;
`;

const Content = styled.span`
  color: rgba(141, 141, 141, 1);
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: normal;
  text-align: left;
  width: 371px;
`;
