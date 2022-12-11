import React, {
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import styled from "@emotion/styled";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Icon, useIcons, IConStyleVariant } from "./resources";
import { IconItem } from "./icon-item";
import InfiniteScroll from "react-infinite-scroller";
import { debounce } from "./utils";
import { IconSearch } from "./icons-search";
import { IconsLoadHistory } from "./history";
import _ from "lodash";

function useRecentlyUsedIcons(max: number = 20) {
  const [recentIcons, setRecentIcons] = useState<Icon[]>([]);
  const h = useMemo(() => new IconsLoadHistory(max), []);

  useEffect(() => {
    setRecentIcons(h.list());
  }, [h]);

  const addHistory = useCallback(
    (icon: Icon) => {
      h.push(icon);
      setRecentIcons(h.list());
    },
    [h]
  );

  return [recentIcons, addHistory] as const;
}

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

  const [recentlyUsedIcons, addHistory] = useRecentlyUsedIcons();
  const { icons, hasMore } = useIcons({
    max: max,
    query: query,
  });

  useEffect(() => {
    // reset max to 100
    setMax(100);
  }, [iconProperty, query]);

  const onIconClick = (icon: Icon) => {
    addHistory(icon);
  };

  const loading = icons === undefined;
  const do_show_recently_used = recentlyUsedIcons?.length > 0 && !query;

  // group by package
  const grouped = _.groupBy(icons ?? [], (d) => d.package);

  return (
    <>
      <IconSearch
        onChange={debounce(setQuery, 200)}
        onSelectIconProperty={setIconProperty}
      />
      <>
        <StyledLinearProgress
          style={{
            display: loading ? "block" : "none",
          }}
        />

        <InfiniteScroll
          pageStart={0}
          hasMore={hasMore}
          loadMore={() => {
            setMax((d) => d + 100);
          }}
        >
          <ListWrap>
            {do_show_recently_used && (
              <Section>
                <h6 className="title">Frequently used</h6>
                <IconList icons={recentlyUsedIcons} onIconClick={onIconClick} />
              </Section>
            )}

            {Object.keys(grouped).map((key) => {
              const icons = grouped[key];
              return (
                <Section key={key}>
                  <h6 className="title">{key}</h6>
                  <IconList icons={icons} onIconClick={onIconClick} />
                </Section>
              );
            })}
            {/* {icons?.length > 0 && (
              <IconList icons={icons} onIconClick={onIconClick} />
            )} */}
          </ListWrap>
        </InfiniteScroll>
      </>
    </>
  );
}

const IconList = React.forwardRef(function (
  {
    icons,
    onIconClick,
  }: {
    icons: Icon[];
    onIconClick?: (icon: Icon) => void;
  },
  ref: any
) {
  return (
    <>
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
              <IconItem
                {...icon}
                onClick={() => {
                  onIconClick?.(icon);
                }}
              />
            </GridItem>
          );
        })}
      </GridList>
    </>
  );
});

const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
  .title {
    margin: 0;
    padding: 16px;
    padding-right: 0;
    font-size: 12px;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.54);
    text-transform: uppercase;
  }
`;

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
    background-color: black;
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
