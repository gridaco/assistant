import React from "react";

export function GroupLabel({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}
