import React, { useState } from "react";
import styled from "@emotion/styled";
import { BlueButtonStyle } from "@ui/core/button-style";
import { registerScene } from "@app/scene-view";
import { PluginSdk } from "@plugin-sdk/app";
import type { IReflectNodeReference } from "@design-sdk/figma-node";
import { isAuthenticated } from "@assistant-fp/auth";
import { useHistory } from "react-router-dom";

/**
 * @deprecated
 * Next upload button to register the scene to the backend, view via https://app.grida.co/scenes/:id
 */
export function Legacy__NextUploadButton(props: {
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
          app: props.app,
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
  ${BlueButtonStyle}
  min-width: 60%;
`;
