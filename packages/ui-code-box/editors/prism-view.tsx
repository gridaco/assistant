import React, { useEffect } from "react";
import {
  default as PrismHighlight,
  defaultProps,
  Language,
  Prism,
} from "prism-react-renderer";
// import Prism from "prism-react-renderer/prism";
import styled from "@emotion/styled";
import vsdark from "prism-react-renderer/themes/vsDark";

export function PrismView(props: { src: string; language: any | Language }) {
  useEffect(() => {
    if (props.language == "dart") {
      // region custom dart support
      // https://github.com/FormidableLabs/prism-react-renderer/issues/22#issuecomment-553042928
      const dartLang = require("refractor/lang/dart");
      dartLang(Prism);
      // endregion
    }
  }, [props.language]);

  return (
    <PrismHighlight
      {...defaultProps}
      theme={vsdark}
      Prism={Prism}
      code={props.src}
      language={props.language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <CodeInnerWrapper className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </CodeInnerWrapper>
      )}
    </PrismHighlight>
  );
}

const CodeInnerWrapper = styled.pre`
  .token {
    font-family: "Source Code Pro", "Courier New", "Lucida Console", Monaco;
    font-size: 14px;
    line-height: 98%;
    font-weight: 400;
  }
  width: 100%;
  padding: 8px;

  // for reset pre user agent style
  margin: 0;

  /* height: 408px; */
  /* margin: 0 8px; */
  /* margin: 0 -8px; */
  /* overflow: scroll; */
`;
