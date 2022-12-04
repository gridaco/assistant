import styled from "@emotion/styled";
import React, { ReactNode } from "react";
import { BlackButtonStyle } from "@ui/core/button-style";

interface Props {
  coverImage?: string;
  content: ReactNode;
  buttonText: string;
  onClick: () => void;
}

export function CommingSoonTemplate(props: Props) {
  return (
    <Wrapper>
      {props.coverImage && (
        <ImageBox>
          <Image src={props.coverImage} />
        </ImageBox>
      )}

      <Content hasImage={!!props.coverImage}>{props.content}</Content>
      <ButtonWrapper>
        <Button onClick={props.onClick}>{props.buttonText}</Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const ImageBox = styled.div``;

const Image = styled.img`
  width: 100vw;
  height: auto;
`;

const Content = styled.div<{ hasImage: boolean }>`
  margin-top: ${(props) => (props.hasImage ? "27px" : "36px")};
  padding: 0 16px;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 12px;
  margin: 0 16px;
`;

const Button = styled.button`
  ${BlackButtonStyle}
  width: calc(100vw - 32px);
`;
