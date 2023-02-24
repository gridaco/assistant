import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { SearchInput } from "@ui/core/search";
import * as api from "./client";
import { LoadableGraphicItem } from "./image-item";
import { EK_CREATE_IMAGE } from "@core/constant/ek.constant";
import { PluginSdk } from "@plugin-sdk/app";

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
  const [images, setImages] = useState<{ images: Array<PlacableImage> }>({
    images: [],
  });
  const [locked, setLocked] = useState(false);
  const [query, setQuery] = useState("");
  const [isQuerySufficientForGeneration, setIsQuerySufficientForGeneration] =
    useState(false);

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

      setLocked(true);
      const { images: gens, n } = await api
        .fromResources({
          q: query,
        })
        .finally(() => setLocked(false));

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
            <GridItem key={index}>
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
            </GridItem>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;

const GridItem = styled.figure`
  padding: 0;
  margin: 0;
  margin-bottom: 16px;
  background: gray;
`;

const GenerateButton = styled.button`
  position: absolute;
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
