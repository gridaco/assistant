import React from "react";
import styled from "@emotion/styled";
import CaretDownIcon from "@assistant/icons/caret-down";
import * as k from "../k";

export function StartLayout({ onStartClick }: { onStartClick: () => void }) {
  const [clicked, setClicked] = React.useState(false);

  return (
    <RootWrapperBody>
      <ActoinSection>
        <Header>
          <ArtworkAppGroupedFigmaGridaVscodeArtwork
            src={"/assets/images/artwork-app-grouped-figma-grida-vscode.png"}
            alt="image of ArtworkAppGroupedFigmaGridaVscodeArtwork"
          ></ArtworkAppGroupedFigmaGridaVscodeArtwork>
          <ConnectToAssistantLiveAndIntegrateYourDesignDirectlyOnVsCodeAndMore>
            Connect to Assistant Live and integrate your design directly on{" "}
            <a href={k.VSCODE_MARKET_URL} target="_blank">
              VSCode
            </a>{" "}
            and more.
          </ConnectToAssistantLiveAndIntegrateYourDesignDirectlyOnVsCodeAndMore>
        </Header>
        <InputSection>
          <Button
            disabled={clicked}
            onClick={() => {
              setClicked(true);
              onStartClick();
            }}
          >
            <Label>{clicked ? "Connecting.." : "Start Session"}</Label>
          </Button>
        </InputSection>
      </ActoinSection>
      <Spacer></Spacer>
      <IntegrationsDocsSection>
        <ScrollDownIndication>
          <Integrations>Integrations</Integrations>
          <CaretDownIcon alt="image of IconsMdiKeyboardArrowDown" />
        </ScrollDownIndication>
        <GraphicsAndDescriptionVscode>
          <MacIconVscodeArtwork
            src={"/assets/images/mac-icon-vscode.png"}
            alt="image of MacIconVscodeArtwork"
          ></MacIconVscodeArtwork>
          <Description>
            <Content>
              (Beta) To get strated with VSCode integration,{" "}
              <a href={k.VSCODE_MARKET_URL} target="_blank">
                install the vscode extension from here
              </a>
              , signin and select your design from this assistant plugin.
            </Content>
          </Description>
        </GraphicsAndDescriptionVscode>
        <GraphicsAndDescriptionGridacode>
          <MacIconGridaArtwork
            src={"/assets/images/mac-icon-grida.png"}
            alt="image of MacIconGridaArtwork"
          ></MacIconGridaArtwork>
          <Description_0001>
            <Content_0001>
              (Beta) To get started with Grida code live, visit
              code.grida.co/live and select your design from this assistant
              plugin.
            </Content_0001>
          </Description_0001>
        </GraphicsAndDescriptionGridacode>
      </IntegrationsDocsSection>
    </RootWrapperBody>
  );
}

const RootWrapperBody = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: start;
  flex: none;
  gap: 0;
  box-sizing: border-box;
`;

const ActoinSection = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: start;
  flex: 1;
  gap: 80px;
  align-self: stretch;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 8px;
  align-self: stretch;
  height: 336px;
  box-sizing: border-box;
  padding: 21px 21px;
`;

const ArtworkAppGroupedFigmaGridaVscodeArtwork = styled.img`
  height: 232px;
  object-fit: cover;
`;

const ConnectToAssistantLiveAndIntegrateYourDesignDirectlyOnVsCodeAndMore = styled.span`
  color: rgba(149, 149, 149, 1);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Helvetica, sans-serif;
  font-weight: 400;
  text-align: center;
  width: 269px;
`;

const InputSection = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: start;
  flex: none;
  gap: 10px;
  align-self: stretch;
  height: 140px;
  box-sizing: border-box;
  padding: 32px 32px;
`;

const Button = styled.button`
  cursor: pointer;
  outline: none;
  border: none;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 10px;
  border-radius: 4px;
  align-self: stretch;
  background-color: rgba(21, 22, 23, 1);
  box-sizing: border-box;
  max-height: 48px;
  padding: 14px 36px;
  :disabled {
    opacity: 50%;
    cursor: wait; // for conviniency - should'nt do this really.
  }
`;

const Label = styled.span`
  color: rgba(255, 255, 255, 1);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 700;
  text-align: left;
`;

const Spacer = styled.div`
  height: 160px;
  align-self: stretch;
`;

const IntegrationsDocsSection = styled.div`
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
  width: 91px;
  height: 24px;
  box-sizing: border-box;
`;

const Integrations = styled.span`
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

const GraphicsAndDescriptionVscode = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 0;
  align-self: stretch;
  box-sizing: border-box;
`;

const MacIconVscodeArtwork = styled.img`
  width: 115px;
  height: 115px;
  object-fit: cover;
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
  white-space: pre-wrap;
  color: rgba(141, 141, 141, 1);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
  width: 372px;
`;

const GraphicsAndDescriptionGridacode = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 0;
  align-self: stretch;
  box-sizing: border-box;
`;

const MacIconGridaArtwork = styled.img`
  width: 115px;
  height: 115px;
  object-fit: cover;
`;

const Description_0001 = styled.div`
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

const Content_0001 = styled.span`
  color: rgba(141, 141, 141, 1);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
  width: 372px;
`;
