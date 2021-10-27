import React from "react";
import styled from "@emotion/styled";
import { LinkInput } from "../components";

/**
 * ![](https://www.figma.com/file/4hqwYFw6FKw1njvzEl3VUh/assistant?node-id=4473%3A37403)
 * @returns
 */
function FigmaFileChecksum() {
  return (
    <RootWrapperFigmaFileChecksum>
      <MdiArrowBack
        src="grida://assets-reservation/images/4473:37442"
        alt="image of MdiArrowBack"
      ></MdiArrowBack>
      <ContentBody>
        <Header>
          <Title>Allow us to access this file.</Title>
          <Desc>Copy & Paste the link to this current file.</Desc>
        </Header>
        <Spacer></Spacer>
        <InputSection>
          <LinkInput />
        </InputSection>
        <Spacer_0001></Spacer_0001>
        <HowToArea>
          <ScrollDownIndication>
            <HowToGetTheLink>How to get the link</HowToGetTheLink>
            <IconsMdiKeyboardArrowDown
              src="grida://assets-reservation/images/4473:37447"
              alt="image of IconsMdiKeyboardArrowDown"
            ></IconsMdiKeyboardArrowDown>
          </ScrollDownIndication>
          <GraphicsAndDescription>
            <FigmaDesktopWhereIsShareButtonArtwork
              src="grida://assets-reservation/images/4473:37479"
              alt="image of FigmaDesktopWhereIsShareButtonArtwork"
            ></FigmaDesktopWhereIsShareButtonArtwork>
            <Description>
              <Content>
                On browser, simply copy-paste the current link below. On Figma
                desktop app, click Share - Copy link, paste the copied url
                below. (You don’t need to change sharing options)
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

const MdiArrowBack = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
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

const IconsMdiKeyboardArrowDown = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
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

export default FigmaFileChecksum;
