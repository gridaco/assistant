import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Icon, useIcons, IConStyleVariant } from "./resources";
import { IconItem } from "./icon-item";
import InfiniteScroll from "react-infinite-scroller";
import { debounce } from "./utils";
import { IconSearch } from "./icons-search";

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

const ListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
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
