import React from "react";
import styled from "@emotion/styled";
import { PromptInputBox, Bubble, GroupLabel } from "./components";
import { LightningBoltIcon } from "@radix-ui/react-icons";

export function CopywriterScreen() {
  return (
    <div
      style={{
        margin: 16,
      }}
    >
      <PromptInputBox />

      <div
        style={{
          marginTop: 32,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <GroupLabel>
          <LightningBoltIcon />
          Shortcuts
        </GroupLabel>
        <Bubble>
          <p>
            Translate to{" "}
            <InlineSelect defaultValue="fr">
              <option value="fr">French</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="en">English</option>
            </InlineSelect>
          </p>
        </Bubble>
        <Bubble>
          <p>Give me Ideas</p>
        </Bubble>
        <Bubble>
          <p>
            Placeholder Text for
            <InlineSelect defaultValue="p">
              <option value="p">Paragraph</option>
              <option value="h1">Headline</option>
            </InlineSelect>
          </p>
        </Bubble>
      </div>
    </div>
  );
}

const InlineSelect = styled.select`
  display: inline-block;
  margin-left: 4px;
  margin-right: 4px;
  outline: none;
  border: none;
  background: none;
`;
