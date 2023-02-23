// FIXME HAS ERROR!
// react-virtualized image measurer
// error message
// Critical dependency: require function is used in a way in which dependencies cannot be statically extracted

import React, { useState } from "react";
import styled from "@emotion/styled";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { list, itemsWithSizes } from "./.test";
import { SearchInput } from "@ui/core/search";

// Array of images with captions
//const list = [{image: 'http://...', title: 'Foo'}];

// We need to make sure images are loaded from scratch every time for this demo
const noCacheList = list.map((item, index) => ({
  title: index + ". " + item.title,
  image: item.image + (item.image ? "?noCache=" + Math.random() : ""),
}));

export function PhotoLoader() {
  const [state, setState] = useState({ images: noCacheList });
  return (
    <Wrapper>
      <SearchInput placeholder={`Try "astronaut with cowboy hat"`} />
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry
          style={{
            gap: 16,
          }}
        >
          {state.images.map((item, index) => (
            <GridItem key={index}>
              <LoadableGraphicItem src={item.image} name={item.title} />
            </GridItem>
          ))}
          {/* {images.map((image, i) => (
            <img
              key={i}
              src={image}
              style={{ width: "100%", display: "block" }}
              alt=""
            />
          ))} */}
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

interface OverlayStyle extends React.CSSProperties {
  "--progress"?: number;
}

function LoadableGraphicItem({ name, src }: { name: string; src: string }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

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
