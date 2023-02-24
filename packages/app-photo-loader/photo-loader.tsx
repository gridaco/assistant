import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { SearchInput } from "@ui/core/search";
import * as api from "./client";
import { LoadableGraphicItem } from "./image-item";
import { EK_CREATE_IMAGE } from "@core/constant/ek.constant";
import { motion } from "framer-motion";
import { PluginSdk } from "@plugin-sdk/app";
import { useSetRecoilState } from "recoil";
import { hide_navigation } from "app/lib/main/global-state-atoms";

///
///  TODO:
///  2. Support for DND
///  3. Support for replace fill(s)
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
        type: EK_CREATE_IMAGE,
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
  const set_hide_navigation_state = useSetRecoilState(hide_navigation);

  const hidenav = useCallback(() => {
    set_hide_navigation_state(true);
  }, [set_hide_navigation_state]);

  const shownav = useCallback(() => {
    set_hide_navigation_state(false);
  }, [set_hide_navigation_state]);

  const [images, setImages] = useState<{ images: Array<PlacableImage> }>({
    images: [],
  });
  const [locked, setLocked] = useState(false);
  const [query, setQuery] = useState("");
  const [isQuerySufficientForGeneration, setIsQuerySufficientForGeneration] =
    useState(false);

  useEffect(() => {
    if (images.images.length > 0) {
      hidenav();
    } else {
      shownav();
    }
  }, [images]);

  const promptGeneration = async () => {
    setLocked(true);
    const { images: gens, n } = await api
      .fromGenerative({
        q: query,
      })
      .finally(() => setLocked(false));

    setImages({
      images: gens.map((g) => ({
        src: g,
        thumbnail: g,
        name: `${n} ${query}`,
      })),
    });
  };

  useEffect(() => {
    if (isQuerySufficientForGeneration) {
      setImages({
        images: [],
      });
    }
  }, [isQuerySufficientForGeneration]);

  const searchResources = useCallback(
    async (query: string) => {
      if (isQuerySufficientForGeneration) {
        return;
      }

      const { images: gens, n } = await api.fromResources({
        q: query,
      });

      if (!isQuerySufficientForGeneration) {
        setImages({
          images: gens.map((g) => ({
            thumbnail: g.thumbnail,
            src: g.url,
            name: g.alt,
          })),
        });
      }
    },
    [isQuerySufficientForGeneration]
  );

  const onclear = () => {
    setQuery("");
    setIsQuerySufficientForGeneration(false);
    setImages({
      images: [],
    });
    shownav();
  };

  const debouncedSearch = useCallback(debounce(searchResources, 1200), [
    searchResources,
    isQuerySufficientForGeneration,
  ]);

  return (
    <Wrapper>
      <SearchInput
        readonly={locked}
        loading={locked}
        onEnter={() => {
          if (isQuerySufficientForGeneration) {
            promptGeneration();
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
        placeholder={`Try "astronaut with cowboy hat"`}
      />
      {isQuerySufficientForGeneration && (
        <GenerateButton onClick={promptGeneration}>⚡️ Generate</GenerateButton>
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
          {images.images.map((item, index) => (
            <GridItem key={item.src}>
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
    </Wrapper>
  );
}

const DelayedMotionShowup = ({ children, index = 0, delay = 0.04 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * delay }}
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
`;

const GenerateButton = styled.button`
  position: fixed;
  z-index: 9;
  bottom: 16px;
  right: 16px;
  left: 16px;
  padding: 8px 16px;
  border: none;
  background: black;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
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
