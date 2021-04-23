import { Button, TextField } from "@material-ui/core";
import React, { useRef, useState } from "react";

type UserInteractionMode = "editing" | "viewing";

const ModeToggleButton = (props: {
  current: UserInteractionMode;
  onSave: () => void;
  onStartEdit: () => void;
}) => {
  if (props.current == "viewing") {
    return <Button onClick={props.onStartEdit}>edit</Button>;
  }
  return <Button onClick={props.onSave}>save</Button>;
};

export interface ISingleLayerProperty {
  name: string;
  type: string;
  /**
   * spec for json schema
   */
  description?: string;
  /**
   * how this layer will be located percisely in complex design node tree
   */
  locateMode: string;
  /**
   * target property on layer.
   * for example if this is a text layer's property,
   * it can be mapped to text#characters or also text#fills[0].
   * but only once at a time.
   */
  targetProperty: string;
}
interface ISingleLayerPropertyDefinitionProps {
  initial?: ISingleLayerProperty;
  onSave: (data: ISingleLayerProperty) => void;
}

export function SingleLayerPropertyDefinition(
  props: ISingleLayerPropertyDefinitionProps
) {
  const [data, setData] = useState<ISingleLayerProperty>(props.initial);

  // if no initial data provided, start with editing mode
  const _initialMode: UserInteractionMode = props.initial
    ? "viewing"
    : "editing";

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

  return (
    <>
      <form>
        <TextField
          required
          label="name"
          defaultValue={data?.name}
          onChange={(e) => {
            setData({
              ...data,
              name: e.target.value,
            });
          }}
          helperText="name for this property"
          disabled={disableInputs}
        />
        <TextField
          label="description"
          defaultValue={data?.description}
          onChange={(e) => {
            setData({
              ...data,
              description: e.target.value,
            });
          }}
          helperText="description for this property"
          disabled={disableInputs}
        />
        <TextField
          label="type"
          required
          defaultValue={data?.type}
          onChange={(e) => {
            setData({
              ...data,
              type: e.target.value,
            });
          }}
          disabled={disableInputs}
        />
        <TextField
          label="how to locate"
          onChange={(e) => {
            setData({
              ...data,
              locateMode: e.target.value,
            });
          }}
          defaultValue={data?.locateMode}
          disabled={disableInputs}
        />
        <ModeToggleButton
          current={mode}
          onSave={handleSave}
          onStartEdit={handleStartEdit}
        />
      </form>
    </>
  );
}
