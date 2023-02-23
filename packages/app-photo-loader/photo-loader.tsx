// FIXME HAS ERROR!
// react-virtualized image measurer
// error message
// Critical dependency: require function is used in a way in which dependencies cannot be statically extracted

import React, { useState } from "react";
import styled from "@emotion/styled";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { list, itemsWithSizes } from "./.test";

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
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry>
          {state.images.map((item, index) => (
            <GridItem key={index}>
              <img
                style={{ width: "100%", height: "100%", display: "block" }}
                src={item.image}
                alt=""
              />
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
  background: gray;
`;
