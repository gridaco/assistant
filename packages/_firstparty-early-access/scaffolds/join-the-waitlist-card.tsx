import React from "react";
import styled from "@emotion/styled";

export function JoinWaitlistCard() {
  return (
    <RootWrapperJoinWaitlistCard>
      <Heading>Not Invited yet?</Heading>
      <Description>
        At this moment, we are limiting access with invite-only policy. Please
        join our waitlist to get invited.
      </Description>
      <ActionAsButton
        onClick={() => {
          open("https://grida.co/assistant#join-the-waitlist");
        }}
      >
        Join the waitlist
      </ActionAsButton>
    </RootWrapperJoinWaitlistCard>
  );
}

const RootWrapperJoinWaitlistCard = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 37px;
  box-shadow: 0px 4px 48px 24px rgba(0, 0, 0, 0.04);
  border: solid 1px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
  box-sizing: border-box;
  padding: 39px 30px;
`;

const Heading = styled.span`
  color: rgba(0, 0, 0, 0.8);
  text-overflow: ellipsis;
  font-size: 21px;
  font-family: Inter, sans-serif;
  font-weight: 700;
  text-align: center;
`;

const Description = styled.span`
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  line-height: 96%;
  text-align: center;
  max-width: 260px;
`;

const ActionAsButton = styled.button`
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 4px;
  padding: 10px 16px;
  color: white;
  font-size: 18px;
  font-family: "Roboto Mono", sans-serif;
  font-weight: 500;
  border: none;
  outline: none;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :disabled {
    opacity: 0.5;
  }

  :active {
    opacity: 1;
  }

  :focus {
  }
`;
