import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { withStyles, Select, MenuItem, InputBase } from "@material-ui/core";
import { SearchInput } from "@ui/core/search";

export function IconSearch(props: {
  onChange: (value: string) => void;
  onSelectIconProperty: (value: any) => void;
}) {
  // const iconPropertyList = {
  //   default_size: ["Size", "16", "20", "24", "28", "32"],
  //   variant: ["Variant", "Outlined", "Twotone", "Default", "Sharp"],
  // };
  // const [iconProperty, setIconProperty] = useState({
  //   default_size: "Size",
  //   variant: "Variant",
  // });

  // const BootstrapInput = withStyles((theme) => ({
  //   root: {
  //     "label + &": {
  //       marginTop: theme.spacing(3),
  //     },
  //   },
  //   input: {
  //     fontSize: 14,
  //   },
  // }))(InputBase);

  // const onSelectValue = (type: string, value: any) => {
  //   if (type === "size") {
  //     props.onSelectIconProperty((d) => ({
  //       ...d,
  //       default_size: value.toLocaleLowerCase(),
  //     }));
  //     setIconProperty((d) => ({
  //       ...d,
  //       default_size: value,
  //     }));
  //   } else if (type === "variant") {
  //     props.onSelectIconProperty((d) => ({
  //       ...d,
  //       variant: value.toLocaleLowerCase(),
  //     }));
  //     setIconProperty((d) => ({
  //       ...d,
  //       variant: value,
  //     }));
  //   }
  // };

  return (
    <ControlsWrapper>
      <SearchInput
        placeholder="Search with icon name"
        onChange={(v) => {
          props.onChange(v.toLocaleLowerCase());
        }}
      />
      {/* <Filters>
        <TypeCheck>
          <StyledSelect
            classes={{ root: "root" }}
            value={iconProperty.variant}
            onChange={(e) => onSelectValue("variant", e.target.value)}
            input={<BootstrapInput classes={{ root: "root" }} />}
          >
            {iconPropertyList.variant.map((i) => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
          </StyledSelect>
        </TypeCheck>
        <SizeCheck>
          <StyledSelect
            classes={{ root: "root" }}
            value={iconProperty.default_size}
            onChange={(e) => onSelectValue("size", e.target.value)}
            input={<BootstrapInput />}
          >
            {iconPropertyList.default_size.map((i) => (
              <MenuItem key={i} value={i}>
                {i === "Size" ? "Size" : i + " x " + i}
              </MenuItem>
            ))}
          </StyledSelect>
        </SizeCheck>
      </Filters> */}
    </ControlsWrapper>
  );
}

const ControlsWrapper = styled.div`
  position: relative;
`;

const Filters = styled.div`
  height: 55px;
  width: 100%;
  display: flex;
`;

const TypeCheck = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  cursor: pointer;
  padding: 0px 16px;
`;

const StyledSelect = styled(Select)`
  width: 100% !important;
  &.root {
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
  }
`;

const SizeCheck = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0px 16px;
`;
