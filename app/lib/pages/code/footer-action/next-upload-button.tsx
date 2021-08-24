import React, { useState } from "react";
import styled from "@emotion/styled";
import { BlackButton } from "../../../components/style/global-style";
import { registerScene } from "../../../scene-view";
import { PluginSdk } from "@plugin-sdk/app";
import type { IReflectNodeReference } from "@design-sdk/core/nodes/lignt";
import { isAuthenticated } from "../../../auth";
import { useHistory } from "react-router-dom";

export function NextUploadButton(props: {
  disabled?: boolean;
  scene?: IReflectNodeReference;
  app?: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const register = async () => {
    setIsLoading(true);
    const imageRes = await PluginSdk.getNodeImage({
      id: props.scene.id,
      opt: {
        format: "png",
        contentsOnly: true,
      },
    });

    const rawNode = await PluginSdk.getNode(props.scene.id);

    // register with all data
    return await registerScene({
      ...props.scene,
      raw: rawNode,
      width: rawNode.width,
      height: rawNode.height,
      preview: imageRes.data,
      code: {
        flutter: {
          raw: props.app,
        },
      },
    });
  };

  const onNextClick = async () => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      PluginSdk.notify("Let's Sign in first");
      history.push("/signin");
      return;
    }

    // if authenticated, we can procceed to next step finally. ;)
    register()
      .then((d) => {
        open(buildOpenUrlForRegisteredScene(d.id));
      })
      .catch((e) => {
        console.error("error while registering scene", e);
        PluginSdk.notify(
          "Oops. something went wrong. pplease try again. ;)",
          3
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <NextStepButton
      disabled={props.disabled || isLoading}
      onClick={onNextClick}
    >
      Next
    </NextStepButton>
  );
}

function buildOpenUrlForRegisteredScene(sceneId: string) {
  return `https://app.grida.co/scenes/${sceneId}`;
}

const NextStepButton = styled.button`
  ${BlackButton}
  /* 2/3 size. 12 is wrapper padding  */
  width: calc(66.666% - 12px); /* FIXME: stupid! */

  &:hover {
    color: #fff;
    background: #17181a;
  }
  &:disabled {
    color: #bbbbbb;
    background: #949494;
  }
`;
