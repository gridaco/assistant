import React, { useState } from "react";
import styled from "@emotion/styled";
import { BlackButton } from "../../../components/style/global-style";
import { registerScene } from "../../../scene-view";
import { PluginSdk } from "@plugin-sdk/app";
import type { ReflectSceneNode } from "@design-sdk/core/nodes";

export function NextUploadButton(props: {
  scene?: ReflectSceneNode;
  app?: any;
}) {
  const register = async () => {
    const imageRes = await PluginSdk.getNodeImage({
      id: props.scene.id,
      opt: {
        format: "png",
        contentsOnly: true,
      },
    });

    // register with all data
    return await registerScene({
      ...props.scene,
      preview: imageRes.data,
      code: {
        flutter: {
          raw: props.app,
        },
      },
    });
  };
  return (
    <NextStepButton
      disabled={!props.app}
      onClick={() => {
        register()
          .then((d) => {
            open(buildOpenUrlForRegisteredScene(d.id));
          })
          .catch((e) => {
            PluginSdk.notify(
              "Oops. something went wrong. pplease try again. ;)",
              2
            );
          });
        // upload
        // TODO: the button component should be passed from outer side.
      }}
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
  width: calc(66.666% - 12px);

  &:hover {
    color: #fff;
    background: #17181a;
  }
  &:disabled {
    color: #bbbbbb;
    background: #949494;
  }
`;
