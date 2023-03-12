import React from "react";

export function GroupLabel({
  children,
  style = {},
}: React.PropsWithChildren<{
  style?: React.CSSProperties;
}>) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontSize: 12,
        gap: 4,
        fontWeight: 500,
        cursor: "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
