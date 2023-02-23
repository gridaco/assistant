import React, { useState } from "react";
import { ISingleLayerProperty } from "../types";
import { UserSuggestionReason } from "../property-suggestions";
import { Divider } from "@ui/core";
import * as HoverCard from "@radix-ui/react-hover-card";
import { PropertyFieldDocuemntationHoverCard } from "./property-field-lookup-hover-card";
import { SuggestionItems, Suggestions } from "@code-ui/completion-provider";
import styled from "@emotion/styled";
import Tippy from "@tippyjs/react";
import { BasedToken, Colon, Input } from "@code-ui/token";

type UserInteractionMode = "editing" | "viewing";

const ModeToggleButton = (props: {
  current: UserInteractionMode;
  onSave: () => void;
  onStartEdit: () => void;
}) => {
  if (props.current == "viewing") {
    return <OptionalBtn onClick={props.onStartEdit}>edit</OptionalBtn>;
  }
  return <OptionalBtn onClick={props.onSave}>save</OptionalBtn>;
};

interface ISingleLayerPropertyDefinitionProps {
  initial?: ISingleLayerProperty;
  initialMode?: UserInteractionMode;
  onSave: (data: ISingleLayerProperty) => void;
  /**
   * when remove this whole preference. if not provided, remove button won't be present.
   */
  onRemove?: () => void;
  onCancel?: () => void;
  suggestions: UserSuggestionReason[];
}

export function SingleLayerPropertyDefinition(
  props: ISingleLayerPropertyDefinitionProps
) {
  const [data, setData] = useState<ISingleLayerProperty>(props.initial);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // if no initial data provided, start with editing mode
  const _initialMode: UserInteractionMode =
    props.initialMode ?? (props.initial ? "viewing" : "editing");

  // mode state of the user interaction
  const [mode, setMode] = useState<UserInteractionMode>(_initialMode);

  const handleSave = () => {
    props.onSave(data);
    setMode("viewing");
  };

  const handleStartEdit = () => {
    setMode("editing");
  };

  // for test
  const items: SuggestionItems[] = [
    {
      id: "29213123123/cover",
      label: "cover",
    },
    {
      id: "94839482/text",
      label: "text",
    },
  ];

  const disableInputs = mode == "viewing";

  const suggestionItems = props.suggestions.map(
    (item: UserSuggestionReason) => {
      if (item.type === "suggestion") {
        return {
          id: item.to,
          label: item.to,
        };
      }
    }
  );

  function suggestionShow() {
    return (
      <div>
        <Suggestions
          items={suggestionItems}
          selectedId={data.schema.description}
          onSelected={(id: string) =>
            setData({
              ...data,
              schema: {
                ...data.schema,
                description: id,
              },
            })
          }
        />
      </div>
    );
  }

  return (
    <>
      <div style={{ margin: 16 }}>
        <Divider />
        <form>
          <HoverCard.Root openDelay={100} closeDelay={100}>
            <HoverCard.Trigger>
              <Flex>
                <BasedToken
                  onClick={() => {}}
                  onDoubleClick={() => {}}
                  cornerRadius={2}
                  contentPadding={[0, 2]}
                  contentColor="#9CDCFE"
                  content={
                    <Input
                      value={data?.schema.name.toString()}
                      defaultValue={data?.schema.name}
                      color="#9CDCFE"
                      onChange={(e) => {
                        setData({
                          ...data,
                          schema: {
                            ...data.schema,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                  }
                />
                <Colon />
                <BasedToken
                  onClick={() => {
                    setIsVisible(!isVisible);
                  }}
                  onDoubleClick={() => {}}
                  onHover={(isOver) => console.log(isOver)}
                  hoverOverlayColor={"rgba(157, 178, 255, 0.25)"}
                  cornerRadius={2}
                  contentPadding={[0, 2]}
                  contentColor="#9CDCFE"
                  content={
                    <div>
                      <StyledTippy
                        visible={isVisible}
                        placement="bottom-start"
                        content={suggestionShow()}
                        max-width={"100%"}
                        delay={[0, 0]}
                      >
                        <div>
                          <Input
                            value={data?.schema.description}
                            placeholder="description doc"
                            color="#9CDCFE"
                            onChange={(e) => {
                              setData({
                                ...data,
                                schema: {
                                  ...data.schema,
                                  description: e.target.value,
                                },
                              });
                            }}
                            disabled={disableInputs}
                          />
                        </div>
                      </StyledTippy>
                    </div>
                  }
                />
              </Flex>

              {data?.layer?.propertyType && (
                <>
                  <BasedToken
                    onClick={() => {
                      console.log("onClicked");
                    }}
                    onDoubleClick={() => {
                      console.log("onDoubleClick");
                    }}
                    onHover={(isOver) => console.log(isOver)}
                    hoverOverlayColor={"rgba(157, 178, 255, 0.25)"}
                    cornerRadius={2}
                    contentPadding={[0, 2]}
                    contentColor="#9CDCFE"
                    content={
                      <Input
                        value={data?.schema.type}
                        defaultValue={data?.schema.type}
                        required
                        placeholder="type"
                        color="#9CDCFE"
                        onChange={(e) => {
                          setData({
                            ...data,
                            schema: {
                              ...data.schema,
                              type: e.target.value,
                            },
                          });
                        }}
                        disabled={disableInputs}
                      />
                    }
                  />
                </>
              )}
            </HoverCard.Trigger>
            {mode == "viewing" && (
              <HoverCard.Content>
                <HoverCard.Arrow />
                <PropertyFieldDocuemntationHoverCard layer={data.layer.id} />
              </HoverCard.Content>
            )}
          </HoverCard.Root>
          <Field>
            <ModeToggleButton
              current={mode}
              onSave={handleSave}
              onStartEdit={handleStartEdit}
            />
            <Splash>/</Splash>
            {props.onRemove && (
              <OptionalBtn onClick={props.onRemove}>add property</OptionalBtn>
            )}

            {props.onCancel && (
              <OptionalBtn onClick={props.onCancel}>remove</OptionalBtn>
            )}
          </Field>
        </form>
      </div>
    </>
  );
}

const Flex = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
`;

const StyledTippy = styled(Tippy)`
  pointer-events: auto !important;
  transform: translate3d(0, -10px, 0px);
`;

const Field = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
`;

const OptionalBtn = styled.button`
  text-decoration: underline;
  outline: none;
  background: transparent;
  color: #868686;
  border: none;
  cursor: pointer;
  align-items: center;
`;

const Splash = styled.span`
  outline: none;
  background: transparent;
  color: #868686;
`;
