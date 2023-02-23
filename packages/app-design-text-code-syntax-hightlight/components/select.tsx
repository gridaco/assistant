import * as React from "react";
import SelectBase from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import styled from "@emotion/styled";
import withStyles from "@material-ui/core/styles/withStyles";
import InputBase from "@material-ui/core/InputBase";

interface Props {
  label: string;
  current: string;
  collection: string[];
  onChange: (event) => void;
}

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    fontSize: 14,
  },
}))(InputBase);

const Select: React.FC<Props> = ({
  label,
  current,
  collection,
  onChange,
}: Props) => {
  return (
    <StyledSelect
      label={label}
      classes={{ root: "root" }}
      onChange={(event) => {
        onChange(event);
      }}
      value={current}
      input={<BootstrapInput classes={{ root: "root" }} />}
    >
      {collection.map((item, index) => {
        return item == current ? (
          <MenuItem selected value={item} key={index}>
            {item}
          </MenuItem>
        ) : (
          <MenuItem value={item} key={index}>
            {item}
          </MenuItem>
        );
      })}
    </StyledSelect>
  );
};

const StyledSelect = styled(SelectBase)`
  width: 100% !important;
  &.root {
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
  }
`;

export default Select;
