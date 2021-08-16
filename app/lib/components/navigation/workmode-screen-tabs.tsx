import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import styled from "@emotion/styled";

function a11yProps(index: number) {
  return {
    id: `app-tab-${index}`,
    // 'aria-controls': `tab-${mode}`,
  };
}

export function WorkmodeScreenTabs(props: {
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
      TabIndicatorProps={{
        style: {
          display: "none",
        },
      }}
    >
      {layout.map((v, i) => {
        return (
          <StyledTab
            key={v.id}
            label={v.name}
            {...a11yProps(i)}
            classes={{ root: "root", selected: "selected" }}
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

const StyledTab = styled(Tab)`
  // for reset @material-ui style
  text-transform: capitalize !important;

  &.root {
    font-size: 14px;
    font-weight: 400 !important;
    line-height: 17px;
    color: #adaeb2;
  }

  &.selected {
    font-size: 14px;
    font-weight: 700 !important;
    line-height: 17px;
    color: #151617;
  }
`;
