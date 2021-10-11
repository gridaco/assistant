import React from "react";
import styled from "@emotion/styled";
import EmptyIcon from "../assets/images/empty-state-icon.png";

interface PreviewEmptyProps {
  type: "static" | "responsive";
}

export function handle_wrap_bg_color(type: string, hasBg: boolean): string {
  if (!hasBg) {
    return "transparent";
  }
  switch (type) {
    case "static":
      return "#F1F1F1";
    case "responsive":
      return "#fff";
  }
}

function baseUrl(url: string): string {
  const _host =
    process.env.NODE_ENV === "production"
      ? "https://assistant-serve.grida.co"
      : "http://localhost:3303";

  return _host + url;
}

export function PreviewEmpty(props: PreviewEmptyProps) {
  console.log(EmptyIcon);
  return (
    <RootWrapperPreviewStaticEmpty>
      <InnerWrap>
        <ArtworkEmptystateRectAndCursorArtwork
          src={baseUrl(EmptyIcon.src)}
          alt="image of empty state icon"
        ></ArtworkEmptystateRectAndCursorArtwork>
        <Notice>
          {props.type === "static" ? "Nothing is selected" : "No Selection"}
        </Notice>
      </InnerWrap>
    </RootWrapperPreviewStaticEmpty>
  );
}

const RootWrapperPreviewStaticEmpty = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: none;
  height: 100%;
  gap: 0;
  box-sizing: border-box;
`;

const InnerWrap = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 8px;
  width: 220px;
  height: 85px;
  box-sizing: border-box;
`;

const ArtworkEmptystateRectAndCursorArtwork = styled.img`
  object-fit: cover;
  margin-left: 4px;
`;

const Notice = styled.span`
  color: #adaeb2;
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: center;
  width: 220px;
`;
