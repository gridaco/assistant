import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { css } from "@emotion/react";
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
          userSelect: "none",
        },
      }}
      style={{
        marginLeft: -12,
      }}
    >
      {layout.map((v, i) => {
        return (
          <StyledTab
            disableRipple
            key={v.id}
            label={v.name}
            {...a11yProps(i)}
            classes={{ root: "root", selected: "selected" }}
          />
        );
      })}
    </Tabs>
  );

  return <>{tabs}</>;
}

const basestyle = css`
  min-width: fit-content;
  max-width: fit-content;
  width: fit-content;
  font-size: 13px;
  line-height: 17px;
  padding-top: 0px;
`;

const StyledTab = styled(Tab)`
  // for reset @material-ui style
  text-transform: capitalize !important;

  &.root {
    ${basestyle}
    font-weight: 400 !important;
    color: #8e8e8e;
  }

  &.selected {
    ${basestyle}
    font-weight: 700 !important;
    color: #151617;
  }
`;
