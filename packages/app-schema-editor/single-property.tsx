import {
  Button,
  Divider,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";
import React, { useState } from "react";
import { ISingleLayerProperty } from "./types";
import { nameit, NameCases } from "@coli.codes/naming";

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

interface ISingleLayerPropertyDefinitionProps {
  initial?: ISingleLayerProperty;
  initialMode?: UserInteractionMode;
  onSave: (data: ISingleLayerProperty) => void;
  /**
   * when remove this whole preference. if not provided, remove button won't be present.
   */
  onRemove?: () => void;
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

        <Select
          label="property"
          onChange={(e) => {
            setData({
              ...data,
              targetProperty: e.target.value as any,
            });
          }}
          defaultValue={data?.targetProperty}
          disabled={disableInputs}
          value={data?.targetProperty}
        >
          {["on click", "on double click", "enabled", "opacity"].map((d) => {
            return (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            );
          })}
        </Select>

        {data?.targetProperty && (
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
        )}

        <Select
          label="how to locate"
          onChange={(e) => {
            setData({
              ...data,
              locateMode: e.target.value as string,
            });
          }}
          defaultValue={data?.locateMode}
          disabled={disableInputs}
          value="auto"
        >
          {["auto"].map((d) => {
            return (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            );
          })}
        </Select>

        <ModeToggleButton
          current={mode}
          onSave={handleSave}
          onStartEdit={handleStartEdit}
        />
        {props.onRemove && (
          <Button variant="outlined" onClick={props.onRemove}>
            remove
          </Button>
        )}
      </form>
    </>
  );
}
