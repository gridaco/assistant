import React, { useState } from "react";
import { Preview } from "../../components/preview";
import Button from "@material-ui/core/Button";

export default function ComponentViewScreen() {
  // TODO load image data from iframe message
  const [previewImage, setPreviewImage] = useState(undefined);
  return (
    <>
      <Preview data={previewImage} name={"replace me"}></Preview>
      <p>component view placeholder</p>
      <Button>storybook</Button>
      <Button>docs</Button>
      <p>example here (todo)</p>
    </>
  );
}
