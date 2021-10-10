import React from "react";
import styled from "@emotion/styled";

export function PreviewStaticEmpty() {
  return (
    <RootWrapperPreviewStaticEmpty>
      <InnerWrap>
        <ArtworkEmptystateRectAndCursorArtwork
          src="https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/c9e8/a3c5/d8dbfe0d870988f5f8999399cb0eede7"
          alt="image of ArtworkEmptystateRectAndCursorArtwork"
        ></ArtworkEmptystateRectAndCursorArtwork>
        <NothingIsSelected>Nothing is selected</NothingIsSelected>
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
  background-color: rgba(241, 241, 241, 1);
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
`;

const NothingIsSelected = styled.span`
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: center;
  width: 220px;
`;
