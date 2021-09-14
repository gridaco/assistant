import React, { useState } from "react";
import { ISingleLayerProperty } from "../types";
import { UserSuggestionReason } from "../property-suggestions";
import { Divider } from "@ui/core";
import * as HoverCard from "@radix-ui/react-hover-card";
import { PropertyFieldDocuemntationHoverCard } from "./property-field-lookup-hover-card";
import { BasedToken, Colon, Input } from "@code-ui/token";
import styled from "@emotion/styled";

type UserInteractionMode = "editing" | "viewing";

const ModeToggleButton = (props: {
  current: UserInteractionMode;
  onSave: () => void;
  onStartEdit: () => void;
}) => {
  if (props.current == "viewing") {
    return <button onClick={props.onStartEdit}>edit</button>;
  }
  return <button onClick={props.onSave}>save</button>;
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

  return (
    <HoverCard.Root openDelay={100} closeDelay={100}>
      <HoverCard.Trigger>
        <div style={{ margin: 16 }}>
          <Divider />
          <form>
            <Flex>
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
                    value="content"
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
                    value="default"
                    // defaultValue={data?.schema.description}
                    placeholder="description doc"
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
                }
              />
            </Flex>
            <select
              onChange={(e) => {
                setData({
                  ...data,
                  layer: {
                    ...data.layer,
                    propertyType: e.target.value as any,
                  },
                });
              }}
              disabled={disableInputs}
            >
              {props.suggestions.map((d) => {
                switch (d.type) {
                  case "suggestion":
                    return (
                      <option
                        key={d.to}
                        value={d.to}
                        selected={data?.layer?.propertyType == d.to}
                      >
                        {d.to}
                      </option>
                    );
                  default:
                    return <></>;
                }
              })}
            </select>

            {data?.layer?.propertyType && (
              <input
                required
                placeholder="type"
                defaultValue={data?.schema.type}
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
            )}

            <ModeToggleButton
              current={mode}
              onSave={handleSave}
              onStartEdit={handleStartEdit}
            />
            {props.onRemove && <button onClick={props.onRemove}>remove</button>}
            {props.onCancel && <button onClick={props.onCancel}>cancel</button>}
          </form>
        </div>
      </HoverCard.Trigger>
      {mode == "viewing" && (
        <HoverCard.Content>
          <HoverCard.Arrow />
          <PropertyFieldDocuemntationHoverCard layer={data.layer.id} />
        </HoverCard.Content>
      )}
    </HoverCard.Root>
  );
}

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
