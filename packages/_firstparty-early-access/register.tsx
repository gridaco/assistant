import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { useHistory } from "react-router-dom";
import BackArrowIcon from "@assistant/icons/back-arrow";
import { RegisterWithCodeCard } from "./scaffolds/register-with-code-card";
import { JoinWaitlistCard } from "./scaffolds/join-the-waitlist-card";

export function UpgradePage() {
  const history = useHistory();

  return (
    <Wrapper>
      <div className="back" onClick={history.goBack}>
        <BackArrowIcon />
      </div>
      <div className="background" style={{ width: 400 }}>
        <Image
          src="/_/early-access/background.png"
          width={400}
          height={640}
          alt={"background"}
        />
      </div>
      <main>
        <div style={{ height: 80 }} />
        <h1>
          Welcome to our
          <br />
          private beta program
        </h1>
        <div style={{ height: 40 }} />
        <RegisterWithCodeCard />
        <div style={{ height: 40 }} />
        <JoinWaitlistCard />
      </main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  .back {
    position: absolute;
    left: 24px;
    top: 24px;
  }

  .background {
    position: absolute;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
    z-index: -1;
    top: 0;
    right: 0;
  }

  main {
    padding: 60px 36px;

    h1 {
      color: black;
      text-overflow: ellipsis;
      font-size: 24px;
      font-family: Inter, sans-serif;
      font-weight: 700;
      text-align: center;
      align-self: stretch;
      flex-shrink: 0;
    }

    h2 {
      color: rgba(0, 0, 0, 0.8);
      text-overflow: ellipsis;
      font-size: 21px;
      font-family: Inter, sans-serif;
      font-weight: 700;
      text-align: center;
    }
  }
`;
