import { Button, Divider, TextField } from "@material-ui/core";
import React, { useRef, useState } from "react";
import { schema } from "coli";
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

/**
 * Storable object. this is stored to layer's metadata. do not modify this.
 */
export interface ISingleLayerProperty {
  schema: schema.IProperty;
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
  initialMode?: UserInteractionMode;
  onSave: (data: ISingleLayerProperty) => void;
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

  return (
    <>
      <Divider />
      <form>
        <TextField
          required
          label="name"
          defaultValue={data?.schema.name}
          onChange={(e) => {
            setData({
              ...data,
              schema: {
                ...data.schema,
                name: e.target.value,
              },
            });
          }}
          helperText="name for this property"
          disabled={disableInputs}
        />
        <TextField
          label="description"
          defaultValue={data?.schema.description}
          onChange={(e) => {
            setData({
              ...data,
              schema: {
                ...data.schema,
                description: e.target.value,
              },
            });
          }}
          helperText="description for this property"
          disabled={disableInputs}
        />
        <TextField
          label="type"
          required
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
