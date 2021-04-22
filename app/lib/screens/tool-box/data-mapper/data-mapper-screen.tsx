import React, { useState } from "react";
import { PluginSdk } from "../../../utils/plugin-provider/plugin-app-sdk";
import { ExampleDataMapperMockDataSource } from "./example-data-source";

const MockSource = new ExampleDataMapperMockDataSource();
export function DataMapperScreen() {
  const [currentData, setCurrentData] = useState(undefined);
  const handleMapDataToSelected = () => {
    const data = MockSource.getSingleRandom();
    setCurrentData(data);
    PluginSdk.appEvent("custom-test", data);
  };

  return (
    <>
      <h3>data mapper</h3>
      <p>{JSON.stringify(currentData)}</p>
      <button onClick={handleMapDataToSelected}>map data to selected</button>
    </>
  );
}
