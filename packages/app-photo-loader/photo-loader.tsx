import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { SearchInput } from "@ui/core/search";
import Axios from "axios";

///
///  TODO:
///  1. Move api client somewhere else
///  2. Support for DND
///  3. Support for replace fill(s)
///

const client = Axios.create({
  baseURL: "/api",
});

interface SearchQuery {
  q: string;
}

interface GenerativeResponse {
  q: string;
  n: number;
  images: string[];
  size: "1024x1024" | "512x512" | "256x256";
}

interface ResourceResponse {
  q: string;
  n: number;
  images: {
    id: string;
    thumbnail: string;
    url: string;
    raw: string;
    alt: string;
    color: string;
    width: number;
    height: number;
    author: {
      username: string;
      name: string;
    };
  }[];
  pages: number;
}

async function fromGenerative(p: SearchQuery): Promise<GenerativeResponse> {
  const { data } = await client.get("/generative/images", {
    params: p,
  });

  return data;
}

async function fromResources(p: SearchQuery): Promise<ResourceResponse> {
  const { data } = await client.get("/resources/images", {
    params: p,
  });

  return data;
}

interface PlacableImage {
  thumbnail: string;
  raw: string;
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
    const { images: gens, n } = await fromGenerative({
      q: query,
    }).finally(() => setLocked(false));

    setImages({
      images: gens.map((g) => ({
        raw: g,
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
      const { images: gens, n } = await fromResources({
        q: query,
      }).finally(() => setLocked(false));

      if (!isQuerySufficientForGeneration) {
        setImages({
          images: gens.map((g) => ({
            thumbnail: g.thumbnail,
            raw: g.raw,
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
              <LoadableGraphicItem src={item.thumbnail} name={item.name} />
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

interface OverlayStyle extends React.CSSProperties {
  "--progress"?: number;
}

function LoadableGraphicItem({
  onResourceReady,
  name,
  src,
}: {
  onResourceReady?: () => void;
  name: string;
  src: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  // TODO: handle on ready (onResourceReady)

  const onclick = () => {
    setIsDownloading(true);

    // mock progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          clearInterval(interval);
          setIsDownloading(false);
          return 0;
        }
        return p + 0.1;
      });
    }, 100);
  };

  return (
    <ItemWrapper onClick={onclick}>
      <img
        style={{ width: "100%", height: "100%", display: "block" }}
        src={src}
        alt={name}
      />
      <div
        className={"loading-overlay"}
        data-state={isDownloading ? "loading" : "idle"}
        style={{ "--progress": progress } as OverlayStyle}
      />
    </ItemWrapper>
  );
}

const ItemWrapper = styled.div`
  position: relative;
  /*  */

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 1;

    &[data-state="idle"] {
      opacity: 0;
    }

    &[data-state="loading"] {
      opacity: 1;
    }

    &[data-state="idle"]::before {
      transform-origin: right;
    }

    &[data-state="loading"]::before {
      transform-origin: left;
    }

    transition: opacity 0.5s ease-in-out;
  }

  .loading-overlay:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    transform: scaleX(var(--progress));
    transition: transform 0.3s linear;
  }
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
