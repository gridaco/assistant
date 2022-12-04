import React from "react";
import styled from "@emotion/styled";
import * as about from "./manifest";
import { __auth_proxy, ProxyAuthenticationMode } from "@base-sdk-fp/auth";
import { useHistory } from "react-router-dom";
import BackArrowIcon from "@assistant/icons/back-arrow";
import { PluginSdk } from "@plugin-sdk/app";
const URLS = {
  logo_256:
    "https://bridged-service-static.s3-us-west-1.amazonaws.com/branding/logo/256.png",
  github_assitant: "https://github.com/gridaco/assistant",
  github_grida: "https://github.com/gridaco",
  homepage_grida: "https://grida.co/",
  /**
   * @todo
   */
  homepage_assitant: "N/A",
  report_issue:
    "https://github.com/gridaco/assistant/issues/new?assignees=&labels=&template=bug_report.md&title=%5BBug%5D",
  feature_request:
    "https://github.com/gridaco/assistant/issues/new?assignees=&labels=&template=feature_request.md&title=FeatureRequest",
  signup: "https://accounts.grida.co/signup",
  blog: "https://blog.grida.co",
  twitter: "https://twitter.com/grida_co",
  facebook: "https://www.facebook.com/grida.co/",
  youtube: "https://www.youtube.com/channel/UCgJO5apXl_pXRfTxNrkbEBw",
  slack:
    "https://join.slack.com/t/gridaco/shared_invite/zt-nmf59381-prFEqq032K~aWe_zOekUmQ",
  instagram: "https://www.instagram.com/grida.co/",
};

export function AboutScreen() {
  const history = useHistory();
  const linkTo = (url: string) => {
    return () => {
      PluginSdk.openUri(url);
    };
  };

  const signIntoAssistant = () => {
    history.push("/signin");
  };

  return (
    <>
      <BackIcon onClick={history.goBack}>
        <BackArrowIcon />
      </BackIcon>
      <AboutTitleSection>
        <Logo src={URLS.logo_256} />
        <About_TextGroup>
          <TitleText>{about.name}</TitleText>
          <VersionText>{about.versionText}</VersionText>
        </About_TextGroup>
      </AboutTitleSection>
      <div style={{ height: 64 }} />
      <MenuContainer>
        <MenuSection>
          <MenuItem onClick={linkTo(URLS.github_assitant)}>Github</MenuItem>
          <MenuItem onClick={linkTo(URLS.report_issue)}>Report Issue</MenuItem>
          <MenuItem onClick={linkTo(URLS.feature_request)}>
            Feature Request
          </MenuItem>
        </MenuSection>
        <MenuSection>
          <MenuSectionTitleItem>More from Grida</MenuSectionTitleItem>
          <MenuItem onClick={signIntoAssistant}>Signup / Signin</MenuItem>
          <MenuItem onClick={linkTo(URLS.blog)}>Medium</MenuItem>
          <MenuItem onClick={linkTo(URLS.homepage_grida)}>Homepage</MenuItem>
        </MenuSection>
      </MenuContainer>
      <FooterSocialContainer>
        <SocialIconButton
          src={_social_icon("antd-twitter-outlined")}
          alt="Grida on twitter"
          onClick={linkTo(URLS.twitter)}
        />
        <SocialIconButton
          src={_social_icon("antd-youtube-default")}
          alt="Grida on youtube"
          onClick={linkTo(URLS.youtube)}
        />
        <SocialIconButton
          src={_social_icon("antd-slack-circle-default")}
          alt="Grida on slack"
          onClick={linkTo(URLS.slack)}
        />
        <SocialIconButton
          src={_social_icon("mdi_facebook")}
          alt="Grida on facebook"
          onClick={linkTo(URLS.facebook)}
        />
        <SocialIconButton
          src={_social_icon("antd-instagram-default")}
          alt="Grida on instagram"
          onClick={linkTo(URLS.instagram)}
        />
        <SocialIconButton
          src={_social_icon("antd-github-default")}
          alt="Grida on github"
          onClick={linkTo(URLS.github_grida)}
        />
      </FooterSocialContainer>
    </>
  );
}

/**
 * e.g. https://bridged-service-static.s3-us-west-1.amazonaws.com/social-icons/grey/antd-github-default.png
 * @param name
 * @returns
 */
function _social_icon(
  name: string,
  options?: {
    variant?: string;
    format?: string;
  }
) {
  const _variant = options?.variant ?? "grey";
  const _format = options?.format ?? "png";
  return (
    "https://bridged-service-static.s3-us-west-1.amazonaws.com/social-icons/" +
    `${_variant}/` +
    `${name}.${_format}`
  );
}

const BackIcon = styled.div`
  margin-top: 24px;
  margin-left: 24px;
`;

const AboutTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 64px;
`;

const About_TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 42px;
`;

const TitleText = styled.h1`
  color: #000000;
  font-size: 24px;
`;

const VersionText = styled.span`
  font-size: 14;
  color: #7e7e7e;
`;

const Logo = styled.img`
  width: 64px;
  height: 64px;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: start;
  padding: 46px;
  text-align: start;
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 62px;
`;

const MenuSectionTitleItem = styled.h6`
  font-size: 18px;
  padding: 0px;
  margin: 0px;
  margin-bottom: 24px;
  font-weight: bold;
`;

const MenuItem = styled.button`
  font-size: 18px;
  text-align: left;
  padding-bottom: 12px;
  border: none;
  padding-left: 0px;
  background-color: transparent;
  color: #7e7e7e;
`;

const FooterSocialContainer = styled.div`
  position: sticky;
  bottom: 0px;
  padding-top: 20px;
  padding-bottom: 46px;
  background-color: white;
  left: 0px;
  right: 0px;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
`;

const SocialIconButton = styled.img`
  padding-left: 10px;
  padding-right: 10px;
  width: 24px;
  height: 24px;
`;
