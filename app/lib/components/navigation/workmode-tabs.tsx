import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

function a11yProps(index: number) {
  return {
    id: `app-tab-${index}`,
    // 'aria-controls': `tab-${mode}`,
  };
}

export function WorkmodeTabs(props: {
  layout: {
    id: string;
    name: string;
  }[];
  tabIndex: number;
  onSelect: (i: number) => void;
}) {
  const { layout, onSelect, tabIndex } = props;

  const handleTabChange = (event, index: number) => {
    onSelect(index);
  };

  const tabs = (
    <Tabs
      value={tabIndex}
      variant="standard"
      scrollButtons="off"
      onChange={handleTabChange}
      aria-label="primary tab"
    >
      {layout.map((v, i) => {
        return (
          <Tab
            key={v.id}
            label={v.name}
            {...a11yProps(i)}
            style={{ textTransform: "capitalize" }}
          />
        );
      })}
    </Tabs>
  );

  return (
    <div className="tabs-wrapper" style={{ margin: "0 -8px" }}>
      {tabs}
    </div>
  );
}
