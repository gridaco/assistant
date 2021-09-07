import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {
  MetaDataRepository,
  MetaDataRepositoryFactory,
} from "@app/meta-editor";
import { useSingleSelection } from "plugin-app";
import { PluginSdk } from "@plugin-sdk/app";

interface MetaDataFieldDef {
  name: string;
  type: MetaDataFieldType;
}

type MetaDataFieldType = "text" | "url";

/**
 * this is a data structure of the meta data to be linked with a common component in existing design system.
 */
// console: <MetaDataField>{
//     name: '',
//     type: ''
// },
// box?: string,
// storybook?: string,
// docs?: string,
// /**
//  * custom docs or
//  */
// docsUrl?: string,
// /**
//  * the target file / directory url indicating this component on git repository.
//  */
// gitUrl?: string,
// name?: string
const DefaultComponentMetaDataSchema: ReadonlyArray<MetaDataFieldDef> = [
  {
    name: "name",
    type: "text",
  },
  {
    name: "storybook",
    type: "text",
  },
  {
    name: "docsUrl",
    type: "url",
  },
  {
    name: "gitUrl",
    type: "url",
  },
  {
    name: "codeSnippet",
    type: "text",
  },
];

export function MetaEditorScreen() {
  const selection = useSingleSelection();

  const [editable, seteditable] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    seteditable(event.target.checked);
  };

  if (!selection) {
    return <EmptyState />;
  }

  return (
    <div key={selection.id}>
      <FormControlLabel
        control={
          <Switch
            checked={editable}
            onChange={handleChange}
            name="editable"
            color="primary"
          />
        }
        label="editable"
      />
      <MetaDataDisplayForm
        editable={editable}
        type="component"
        id={selection.id}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <p>
      no layer / component / instance is selected.
      <br />
      When selecting instance, it won't add data to the master component. you
      have to manullly select master component in order to add meta to the
      master component. (this also works for a variant)
    </p>
  );
}

function MetaDataDisplayForm(props: {
  editable: boolean;
  id: string;
  type: "component" | "instance" | "layer";
}) {
  let repo: MetaDataRepository;
  repo = MetaDataRepositoryFactory.component(props.id);

  const [data, setData] = useState({});

  useEffect(() => {
    if (props.type == "component") {
      // fetch the data
      repo.fetch().then((d) => {
        if (d) {
          setData(d);
        }
      });
    } else {
      throw "neither than type:component is not supported yet.";
    }
  }, []);

  const handleSaveClick = () => {
    repo.update(data);
    setData(data);
  };

  const schema = DefaultComponentMetaDataSchema;
  if (props.editable) {
    return (
      <>
        {schema.map((e) => {
          return (
            <div
              key={e.name}
              style={{
                padding: 16,
              }}
            >
              <MetaDataEditableField
                type={e.type}
                initial={data[e.name]}
                name={e.name}
                onUpdate={(s: string) => {
                  data[e.name] = s;
                }}
              />
            </div>
          );
        })}
        <Button variant="outlined" onClick={handleSaveClick}>
          Save
        </Button>
      </>
    );
  }

  return (
    <>
      {schema.map((e) => {
        return (
          <div
            key={e.name}
            style={{
              padding: 16,
            }}
          >
            <MetaDataDisplayField
              type={e.type}
              value={data[e.name]}
              name={e.name}
            />
          </div>
        );
      })}
    </>
  );
}

function MetaDataDisplayField(props: {
  name: string;
  value: string;
  type: MetaDataFieldType;
}) {
  function drawValueDisplay() {
    switch (props.type) {
      case "text":
        return <Typography variant="caption">{props.value}</Typography>;

      case "url":
        return (
          <Button onClick={() => PluginSdk.openUri(props.value)}>
            {props.value}
          </Button>
        );
    }
  }

  const valueDisplay = drawValueDisplay();

  return (
    <>
      <Typography>{props.name}</Typography>
      {valueDisplay}
    </>
  );
}

function MetaDataEditableField(props: {
  initial: string;
  name: string;
  type: MetaDataFieldType;
  onUpdate: (string) => void;
}) {
  const handleOnChange = (e: any) => {
    const newvalue = e.target.value as string;
    props.onUpdate(newvalue);
  };

  return (
    <>
      <Typography>{props.name}</Typography>
      <TextField
        fullWidth
        defaultValue={props.initial}
        onChange={handleOnChange}
      />
    </>
  );
}
