import React, { useEffect, useRef, useState } from "react";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles, Select, MenuItem, InputBase } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import styled from "@emotion/styled";
import { Icon, useIcons, IConStyleVariant } from "./resources";
import { IconItem } from "./icon-item";
import InfiniteScroll from "react-infinite-scroller";

export function IconsLoader() {
  const [query, setQuery] = useState<string>(undefined);
  const [max, setMax] = useState(100);
  const [iconProperty, setIconProperty] = useState<{
    default_size: string;
    variant: IConStyleVariant | "variant";
    host: string;
  }>({
    default_size: "size",
    variant: "variant",
    host: "material",
  });

  const { icons, hasMore } = useIcons({
    max: max,
    query: query,
  });

  useEffect(() => {
    // reset max to 100
    setMax(100);
  }, [iconProperty, query]);

  return (
    <>
      <IconSearch
        onChange={debounce(setQuery, 200)}
        onSelectIconProperty={setIconProperty}
      />
      <>
        {icons === undefined ? (
          <StyledLinearProgress />
        ) : (
          <InfiniteScroll
            pageStart={0}
            hasMore={hasMore}
            loadMore={() => {
              setMax((d) => d + 100);
            }}
          >
            <IconList icons={icons} />
          </InfiniteScroll>
        )}
      </>
    </>
  );
}

const debounce = (func: any, wait: number) => {
  let timeout: any;
  return function (this: any, ...args: any[]) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

const IconList = React.forwardRef(function (
  { icons }: { icons: Icon[] },
  ref: any
) {
  return (
    <>
      <ListWrap>
        <GridList
          cellHeight="auto"
          cols={5}
          style={{ marginRight: 0, marginLeft: 0 }}
          ref={ref}
        >
          {icons.map((icon) => {
            const { package: _p, name, variant } = icon;
            return (
              <GridItem key={_p + name + variant} classes={{ tile: "tile" }}>
                <IconItem {...icon} />
              </GridItem>
            );
          })}
        </GridList>
      </ListWrap>
    </>
  );
});

function IconSearch(props: {
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
      <SearchBar>
        <Search style={{ fontSize: "20px" }} />
        <Input
          placeholder="Search with icon name"
          onChange={(e) => props.onChange(e.target.value.toLocaleLowerCase())}
        />
      </SearchBar>
      {/* <SearchChecker>
        <TypeCheck>
          <StyledSelect
            classes={{ root: "root" }}
            value={iconProperty.variant}
            onChange={(e) => onSelectValue("variant", e.target.value)}
            input={<BootstrapInput classes={{ root: "root" }} />}
          >
            {iconPropertyList.variant.map((i) => (
              <MenuItem value={i}>{i}</MenuItem>
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
              <MenuItem value={i}>
                {i === "Size" ? "Size" : i + " x " + i}
              </MenuItem>
            ))}
          </StyledSelect>
        </SizeCheck>
      </SearchChecker> */}
    </ControlsWrapper>
  );
}

const ListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ControlsWrapper = styled.div`
  padding-top: 14px;
  padding-bottom: 15px;
  position: relative;
`;

const SearchBar = styled.div`
  width: 100%;
  font-size: 14px;
  height: 55px;
  padding: 8px;
  display: flex;
  align-items: center;

  svg {
    margin: 10px 10px 10px 8px;
    font-size: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 90%;
  border: none;
  outline: none;

  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: #adaeb2;

  &::placeholder {
    color: #adaeb2;
  }
`;

const SearchChecker = styled.div`
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

const StyledLinearProgress = styled(LinearProgress)`
  /* for reset body margin */

  /* reset material-ui style */
  &.color-primary {
    background-color: #ecf1ff;
  }

  &.barColorPrimary {
    background-color: #2562ff;
  }
`;

const GridItem = styled(GridListTile)`
  height: 70px !important;
  display: flex;
  align-items: center;
  justify-content: center;

  &.tile {
    height: auto;
  }
`;
