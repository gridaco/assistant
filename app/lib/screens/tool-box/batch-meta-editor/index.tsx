import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { PLUGIN_KEYS } from "@bridged.xyz/plugin-sdk-react/events";
import Divider from "@material-ui/core/Divider";
import { PluginSdk } from "@bridged.xyz/plugin-sdk-react";
import {
  BatchMetaOperationTargetType,
  SupportedBatchMetaOperationTargetTypes,
} from "@bridged.xyz/plugin-sdk-react/interfaces/meta/meta.types";
import { BatchMetaUpdateRequest } from "@bridged.xyz/plugin-sdk-react/interfaces/meta/meta.requests";

export default function BatchMetaEditor() {
  const [targetType, setTargetType] = useState<BatchMetaOperationTargetType>(
    BatchMetaOperationTargetType.root
  );
  const [propertyName, setPropertyName] = useState("");
  const [propertyValue, setPropertyValue] = useState("");

  const handleTargetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTargetType(event.target.value as BatchMetaOperationTargetType);
  };

  const handleUpdateClick = () => {
    const data: BatchMetaUpdateRequest = {
      targetType: targetType,
      custom: {},
      key: propertyName,
      value: propertyValue,
    };

    parent.postMessage(
      {
        pluginMessage: {
          type: PLUGIN_KEYS.PLUGIN_SDK_EK_BATCH_META_UPDATE,
          data: data,
        },
      },
      "*"
    );
  };

  return (
    <div>
      <Typography variant="h6">BatchMetaEditor</Typography>
      <Typography variant="body1">
        this updates all targeted nodes's global meta property as givven value
      </Typography>
      <TextField
        label="key"
        onChange={(e) => {
          setPropertyName(e.target.value);
        }}
      />
      <div />
      <TextField
        label="value"
        onChange={(e) => {
          setPropertyValue(e.target.value);
        }}
      />
      <div />
      <Select
        labelId="type-select-label"
        id="type-select"
        value={targetType}
        onChange={handleTargetChange}
      >
        {SupportedBatchMetaOperationTargetTypes.map((e) => {
          return (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          );
        })}
      </Select>
      <div style={{ padding: 12 }}>
        <Button variant="contained" onClick={handleUpdateClick}>
          update
        </Button>
      </div>
      <Divider />
      <FetchMetaDataViaKey />
    </div>
  );
}

/**
 * searches global (root) metadata by givven key
 * @returns
 */
function FetchMetaDataViaKey() {
  window.addEventListener("message", (ev) => {
    const type = ev.data?.pluginMessage?.type;
    if (type == "__response__") {
      const data = ev.data?.pluginMessage?.data;
      console.log("pingpong", data);
      setResponse(data);
    }
  });

  const [response, setResponse] = useState<any>(undefined);
  const [key, setKey] = useState("");
  const handleOnSearchClick = () => {
    console.log(`searching with ey ${key}.`);
    PluginSdk.fetchRootMetadata(key);
  };
  return (
    <div>
      <Typography variant="body1">search existing root metadata</Typography>
      <TextField
        label="search key"
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />
      <Button variant="outlined" onClick={handleOnSearchClick}>
        search
      </Button>
      <Typography>the resolved data is..{response ?? "*EMPTY*"}</Typography>
    </div>
  );
}
