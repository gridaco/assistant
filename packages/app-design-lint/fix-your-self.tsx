import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { PluginSdk } from "@plugin-sdk/app";
import { ReflectLintFeedback } from "@reflect-ui/lint/lib/feedbacks";
import { BlackButtonStyle } from "@ui/core/button-style";
import { LintItemRow } from "@app/design-lint";
import { LintProcessPaginator } from "@app/design-lint/lint-process-paginator";
import { _APP_EVENT_LINT_RESULT_EK } from "@app/design-lint/__plugin/events";
import BackArrowIcon from "@assistant/icons/back-arrow";
import { requiresEarlyAccess } from "@assistant-fp/early-access";

/** Fix your self as page with router props ver. (not used. planned.) */
export function FixYourSelfPage(props: {
  proc: string | "current"; // id of lint proc
}) {
  throw "not implemented";
}

type LayerLintMap = Map<string, LayerLint>;
interface LayerLint {
  node: { id: string; name: string };
  feedbacks: ReflectLintFeedback[];
}

/**
 * manual fixing mode of feedbacks grouped by layer.
 * grouping logic live inside this component.
 **/
export function FixYourSelf(props: {
  onClose: () => void;
  feedbacks: ReflectLintFeedback[];
}) {
  const _key_at_index = (i) => {
    return Array.from(layerlintMap.keys())[i];
  };

  const [isDropVisible, setIsDropVisible] = useState(-1);
  const { feedbacks } = props;
  const [layerIndex, setLayerIndex] = useState(0);
  const layerlintMap: LayerLintMap = mapLintsByLayer(feedbacks);
  const [layerlint, setLayerLint] = useState<LayerLint>(null);

  useEffect(() => {
    chaange_layer_index(0);
  }, []);

  const chaange_layer_index = requiresEarlyAccess((i) => {
    setLayerIndex(i);
    const _target = layerlintMap.get(_key_at_index(i));
    setLayerLint(_target);
    PluginSdk.focus(_target.node.id);
  });

  const _page_size = layerlintMap.size;

  return (
    <Wrapper>
      <BackIcon onClick={props.onClose}>
        <BackArrowIcon />
      </BackIcon>

      <LayerWrapper>
        {layerlint &&
          layerlint.feedbacks.map((item, i) => {
            return (
              <LintItemRow
                name={item.name}
                error={item}
                level={item.level}
                key={i}
                expandable={
                  false
                } /* TODO: provide options with expansion, since there is no handy actions available to provide, we are blocking this expansion feature. */
                expand={isDropVisible === i}
                onTap={() => {
                  // focus to the layer again. (even if it's already focused.)
                  const f = feedbacks[layerIndex].node.id; // TODO: use actual id
                  PluginSdk.focus(f);

                  // handle expansion
                  if (isDropVisible === i) {
                    setIsDropVisible(-1);
                  } else {
                    setIsDropVisible(i);
                  }
                }}
              />
            );
          })}
      </LayerWrapper>

      <Pagination>
        <LintProcessPaginator
          onChange={chaange_layer_index}
          index={layerIndex}
          total={_page_size}
        />
      </Pagination>

      <NextLayerBtn
        onClick={() => {
          if (layerIndex === _page_size - 1) {
            props.onClose();
            return;
          }
          chaange_layer_index(layerIndex + 1);
        }}
      >
        {layerIndex < _page_size - 1 ? "Next Layer" : "Complete"}
      </NextLayerBtn>
    </Wrapper>
  );
}

function mapLintsByLayer(feedbacks: ReflectLintFeedback[]): LayerLintMap {
  const layerlintsMap: LayerLintMap = new Map();

  feedbacks.forEach((item) => {
    if (layerlintsMap.has(item.node.id)) {
      // add to existing layer
      layerlintsMap.get(item.node.id).feedbacks.push(item);
    } else {
      layerlintsMap.set(item.node.id, {
        node: { ...item.node },
        feedbacks: [item],
      });
    }
  });

  return layerlintsMap;
}

const Wrapper = styled.div`
  padding: 16px 8px;
`;

const BackIcon = styled.div`
  margin-bottom: 24px;
`;

const LayerWrapper = styled.div`
  // 200 is NextLayerBtn + Pagination + BackIcon
  height: calc(100vh - 200px);
  overflow-y: scroll;
`;

const Pagination = styled.div`
  position: absolute;
  bottom: 83px;
  right: 16px;
`;

const NextLayerBtn = styled.button`
  ${BlackButtonStyle}
  width: calc(100% - 32px);
  position: absolute;
  bottom: 16px;
  left: 16px;
`;
