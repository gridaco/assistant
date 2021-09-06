import React from "react";
import styled from "@emotion/styled";
// import ImageMeasurer from "react-virtualized-image-measurer";
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from "react-virtualized";

const list = [{ image: "http://...", title: "Foo" }];

const noCacheList = list.map((item) => ({
  ...item,
  image: item.image + "?noCache=" + Math.random(),
}));

const columnWidth = 200;
const defaultHeight = 250;
const defaultWidth = columnWidth;

const cache = new CellMeasurerCache({
  defaultHeight,
  defaultWidth,
  fixedWidth: true,
});
const cellPositioner = createMasonryCellPositioner({
  cellMeasurerCache: cache,
  columnCount: 3,
  columnWidth,
  spacer: 10,
});

const MasonryComponent = ({ itemsWithSizes }) => {
  function cellRenderer({ index, key, parent, style }) {
    const { item, size } = itemsWithSizes[index];
    const height = columnWidth * (size.height / size.width) || defaultHeight;

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div style={style}>
          <img
            src={item.image}
            alt={item.title}
            style={{
              height: height,
              width: columnWidth,
            }}
          />
          <h4>{item.title}</h4>
        </div>
      </CellMeasurer>
    );
  }

  return (
    <Masonry
      cellCount={itemsWithSizes.length}
      cellMeasurerCache={cache}
      cellPositioner={cellPositioner}
      cellRenderer={cellRenderer}
      height={600}
      width={800}
    />
  );
};

export function PhotoLoader() {
  return (
    <Wrapper>
      <Inner>
        look at this
        {/* <ImageMeasurer
          items={noCacheList}
          image={(item) => item.image}
          defaultHeight={defaultHeight}
          defaultWidth={defaultWidth}
        >
          {({ itemsWithSizes }) => (
            <MasonryComponent itemsWithSizes={itemsWithSizes} />
          )}
        </ImageMeasurer> */}
        ,
        {/* <Gird>
          <GridItem />
          <GridLongItem />
          <GridItem />
          <GridItem />
          <GridItem />
          <GridLongItem />
        </Gird> */}
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
