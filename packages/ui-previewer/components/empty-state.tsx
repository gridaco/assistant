import React from "react";
import EmptyIndicatorIcon from "@assistant/icons/empty-indicator-icon";
import { Typography } from "@material-ui/core";

export function EmptyState({}: {}) {
  return (
    <>
      <EmptyIndicatorIcon />
      <Typography className="rendering-notify">Nothing is selected</Typography>
    </>
  );
}
