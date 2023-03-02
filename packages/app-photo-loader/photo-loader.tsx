import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "@emotion/styled";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { SearchInput } from "@ui/core/search";
import * as api from "./client";
import { LoadableGraphicItem } from "./image-item";
import { EK_APPLY_IMAGE } from "@core/constant/ek.constant";
import { motion } from "framer-motion";
import { PluginSdk } from "@plugin-sdk/app";
import { useSetRecoilState } from "recoil";
import { hide_navigation } from "app/lib/main/global-state-atoms";
import InfiniteScroll from "react-infinite-scroller";
import { useHistory } from "react-router-dom";
import { radmon_query_placeholder } from "./k";
import { ImagePromptBox } from "./image-prompt-box";
import {
  requiresEarlyAccess,
  useEarlyAccess,
} from "@assistant-fp/early-access";
import { early_access_required_message } from "@assistant-fp/early-access/k";

///
///  TODO:
///  2. Support for DND
///  3. Support random images (on multiple selection)
///  4. Add optimized image loading witn max 4096 in width and height (either)
///

interface CreateImageProps {
  src: string;
  config: {
    name?: string;
    width?: number;
    height?: number;
  };
}

function __plugin_create_image(d: CreateImageProps) {
  parent.postMessage(
    {
      pluginMessage: {
        type: EK_APPLY_IMAGE,
        data: d,
      },
    },
    "*"
  );
}

interface PlacableImage {
  thumbnail: string;
  src: string;
  name: string;
}

export function PhotoLoader() {
  const history = useHistory();
  const placeholder = useMemo(() => radmon_query_placeholder(), []);
  const set_hide_navigation_state = useSetRecoilState(hide_navigation);

  const hidenav = useCallback(() => {
    set_hide_navigation_state(true);
  }, [set_hide_navigation_state]);

  const shownav = useCallback(() => {
    set_hide_navigation_state(false);
  }, [set_hide_navigation_state]);

  const [data, setData] = useState<{
    from_resources: Array<PlacableImage>;
    from_ai: Array<PlacableImage>;
  }>({
    from_resources: [],
    from_ai: [],
  });
  const [locked, setLocked] = useState(false);
  const [query, setQuery] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [isQuerySufficientForGeneration, setIsQuerySufficientForGeneration] =
    useState(false);

  const [hasMore, setHasMore] = useState(false);
  const accesskey = useEarlyAccess();

  // load random images on mount, once.
  useEffect(() => {
    // prompting empty query with spaces will return random images
    searchResources("  ", 1, false);
  }, []);

  useEffect(() => {
    if (data.from_resources.length > 0) {
      if (query.length > 0) {
        hidenav();
      }
    } else {
      shownav();
    }
  }, [data.from_resources, hidenav, shownav, query]);

  const promptGeneration = requiresEarlyAccess(
    async (
      q: string,
      c: {
        style?: string;
      }
    ) => {
      setLocked(true);
      try {
        const { images: gens, n } = await api
          .fromGenerative(
            {
              q: q,
              style: c.style,
            },
            accesskey
          )
          .finally(() => setLocked(false));

        setData({
          from_resources: data.from_resources,
          from_ai: gens.map((g) => ({
            src: g,
            thumbnail: g,
            name: `${n} ${query}`,
          })),
        });
      } catch (e) {
        // if e.message == 'Unauthorized'
        // then show the activation screen
        if (e.message === "Unauthorized") {
          alert(early_access_required_message);
          history.push("/upgrade");
        }
      }
    }
  );

  const searchResources = useCallback(
    async (q: string, page = 1, extend = false) => {
      if (!q) {
        return;
      }

      const {
        images: gens,
        n,
        pages,
      } = await api.fromResources({
        q: q,
        page,
      });

      const newimages = gens.map((g) => ({
        thumbnail: g.thumbnail,
        src: g.url,
        name: g.alt,
      }));

      const images = extend
        ? [...data.from_resources, ...newimages]
        : newimages;

      // remove duplicate with id
      const unique = images.reduce((acc, current) => {
        const x = acc.find((item) => item.src === current.src);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      setData({
        from_resources: unique,
        from_ai: [],
      });

      setSearchKey(q);

      setHasMore(pages > page);
    },
    [data.from_resources]
  );

  const onclear = () => {
    setQuery("");
    setSearchKey("");
    setHasMore(false);
    setLocked(false);
    setIsQuerySufficientForGeneration(false);
    setData({
      from_resources: [],
      from_ai: [],
    });
    shownav();
  };

  const debouncedSearch = useCallback(debounce(searchResources, 1000), [
    searchResources,
  ]);

  return (
    <Wrapper>
      <SearchInput
        readonly={locked}
        loading={locked}
        onEnter={() => {
          if (isQuerySufficientForGeneration) {
            promptGeneration(query, {});
          }
        }}
        onClear={onclear}
        onChange={(value) => {
          setQuery(value);
          setIsQuerySufficientForGeneration(
            // more than 1 word and more than 10 characters
            value.split(" ").length >= 2 && value.length >= 10
          );
          debouncedSearch(value);
        }}
        placeholder={placeholder}
      />
      {isQuerySufficientForGeneration && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          // no bounce
          transition={{ type: "spring", damping: 20 }}
          style={{
            margin: 16,
            marginTop: 0,
          }}
        >
          <ImagePromptBox
            value={query}
            onSubmit={promptGeneration}
            prompting={locked}
            readonly
            autofocus
          />
        </motion.div>
      )}

      <InfiniteScroll
        key={searchKey}
        pageStart={0}
        hasMore={hasMore}
        loadMore={(page) => {
          searchResources(query, page, true);
        }}
      >
        {data.from_ai.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 16,
            }}
          >
            {data.from_ai.map((item, index) => (
              <GridItem key={searchKey + item.src}>
                <DelayedMotionShowup index={index}>
                  <LoadableGraphicItem
                    onResourceReady={() => {
                      // load with plugin messaging
                      PluginSdk.notify("Inserting Image..", 1000);
                      __plugin_create_image({
                        src: item.src,
                        config: {
                          name: item.name,
                        },
                      });
                    }}
                    src={item.thumbnail}
                    name={item.name}
                  />
                </DelayedMotionShowup>
              </GridItem>
            ))}
          </div>
        )}
        <ResponsiveMasonry
          style={{
            margin: "0 16px",
          }}
          columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 3 }}
        >
          <Masonry
            style={{
              gap: 16,
            }}
          >
            {data.from_resources.map((item, index) => (
              <GridItem key={searchKey + item.src}>
                <DelayedMotionShowup index={index}>
                  <LoadableGraphicItem
                    onResourceReady={() => {
                      // load with plugin messaging
                      PluginSdk.notify("Inserting Image..", 1000);
                      __plugin_create_image({
                        src: item.src,
                        config: {
                          name: item.name,
                        },
                      });
                    }}
                    src={item.thumbnail}
                    name={item.name}
                  />
                </DelayedMotionShowup>
              </GridItem>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </InfiniteScroll>
    </Wrapper>
  );
}

const DelayedMotionShowup = ({
  children,
  index = 0,
  delay = 0.04,
  max = 0.2,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * delay, max) }}
    >
      {children}
    </motion.div>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const GridItem = styled.figure`
  padding: 0;
  margin: 0;
  margin-bottom: 16px;
  border-radius: 2px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.1);
  user-select: none;
`;

/**
 * Simpler debounce function for composing with multiple functions
 * @returns
 */
function debounce(func, wait) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
