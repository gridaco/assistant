// FIXME HAS ERROR!
// react-virtualized image measurer
// error message
// Critical dependency: require function is used in a way in which dependencies cannot be statically extracted

import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from "react-virtualized";
import ImageMeasurer from "react-virtualized-image-measurer";
import { list, itemsWithSizes } from "./.test";

// Array of images with captions
//const list = [{image: 'http://...', title: 'Foo'}];

// We need to make sure images are loaded from scratch every time for this demo
const noCacheList = list.map((item, index) => ({
  title: index + ". " + item.title,
  image: item.image + (item.image ? "?noCache=" + Math.random() : ""),
}));

const keyMapper = (item, index) => item.image || index;

const columnWidth = 200;
const defaultHeight = 250;
const defaultWidth = columnWidth;

// Default sizes help Masonry decide how many images to batch-measure
const cache = new CellMeasurerCache({
  defaultHeight,
  defaultWidth,
  fixedWidth: true,
});

// Our masonry layout will use 3 columns with a 10px gutter between
const cellPositionerConfig = {
  cellMeasurerCache: cache,
  columnCount: 3,
  columnWidth,
  spacer: 10,
};

const cellPositioner = createMasonryCellPositioner(cellPositionerConfig);

const MasonryComponent = ({ itemsWithSizes, setRef }) => {
  const cellRenderer = ({ index, key, parent, style }) => {
    const { item, size } = itemsWithSizes[index];
    const height = columnWidth * (size.height / size.width) || defaultHeight;

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div style={style}>
          <div>{item.title}</div>
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              style={{
                height: height,
                width: columnWidth,
                display: "block",
              }}
            />
          )}
        </div>
      </CellMeasurer>
    );
  };

  return (
    <Masonry
      cellCount={itemsWithSizes.length}
      cellMeasurerCache={cache}
      cellPositioner={cellPositioner}
      cellRenderer={cellRenderer}
      height={800}
      width={300}
      keyMapper={keyMapper}
      ref={setRef}
    />
  );
};

export function PhotoLoader() {
  const [state, setState] = useState({ images: noCacheList });

  let masonryRef = null;

  // this shows how to significantly change the input array, if items will be only appended this recalculation is not needed

  const setMasonry = (node) => (masonryRef = node);

  return (
    <Wrapper>
      <Inner>
        <p>
          HAS ERROR! in react-virtualized image measurer <br /> <br />
          <b> error message</b> <br />
          <i>
            Critical dependency: require function is used in a way in which
            dependencies cannot be statically extracted
          </i>
          <br />
          <br />
          react-virtualized-image-measurer{" "}
          <a href="https://codesandbox.io/s/7y66p25qv6?file=/index.js">
            codesandbox link
          </a>
        </p>

        {/* <ImageMeasurer
        items={state.images}
        image={(item) => item.image}
        keyMapper={keyMapper}
        onError={(error, item, src) => {
          console.error(
            "Cannot load image",
            src,
            "for item",
            item,
            "error",
            error
          );
        }}
        defaultHeight={defaultHeight}
        defaultWidth={defaultWidth}
      >
        {({ itemsWithSizes }) => (
          <MasonryComponent
            setRef={setMasonry}
            itemsWithSizes={itemsWithSizes}
          />
        )}
      </ImageMeasurer> */}
      </Inner>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;

const Inner = styled.div`
  // FIXME: body margin 8 + inner margin 8 = figma style margin 16
  margin: 8px;
`;

const Gird = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-columns: auto;
`;

const GridLongItem = styled.div`
  background: gray;
  height: 300px;
`;

const GridItem = styled.div`
  background: gray;
  height: 200px;
`;

const ImageLoader = styled.div``;
