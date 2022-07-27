import React from "react";

export type Categroy =
  | "interface"
  | "layout"
  | "basics"
  | "media"
  | "seo"
  | "utils";
import { keys } from "@code-features/flags";
// import type { CameraDisplayFlag } from "@code-features/flags";

export interface LibraryItem {
  id: string;
  name: string;
  description: string | React.ReactElement;
  category: Categroy;
  fields?: {
    [key: string]: {
      placeholder?: string;
      required?: boolean;
      initial?: string;
      type: "string";
    };
  };
}

const config: { [key: string]: LibraryItem } = {
  // basics
  [keys.flag_key__as_button]: {
    id: keys.flag_key__as_button,
    name: "Button",
    category: "basics",
    description: "Specifies the button",
  },
  [keys.flag_key__as_checkbox]: {
    id: keys.flag_key__as_checkbox,
    name: "Check box",
    category: "basics",
    description: "checkbox",
  },
  [keys.flag_key__as_input]: {
    id: keys.flag_key__as_input,
    name: "Input",
    category: "basics",
    description: "text input",
  },
  [keys.flag_key__as_slider]: {
    id: keys.flag_key__as_slider,
    name: "Slider",
    category: "basics",
    description: "slider",
  },
  [keys.flag_key__as_progress]: {
    id: keys.flag_key__as_progress,
    name: "Linear Progress",
    category: "basics",
    description: "linear progress bar",
  },
  // media
  [keys.flag_key__camera]: {
    id: keys.flag_key__camera,
    name: "Camera view",
    category: "media",
    description: (
      <p>
        Specifies the view to stream the primary camera stream.{" "}
        <i>(Preview will not work in Assistant due to security reasons)</i>
      </p>
    ),
    fields: {
      camera: {
        initial: undefined,
        placeholder: "Front / Back",
        type: "string",
      },
    },
  },
  [keys.flag_key__x_google_maps_view]: {
    id: keys.flag_key__x_google_maps_view,
    name: "Google Maps",
    category: "media",
    description: <p>google maps view</p>,
    fields: {
      location: {
        required: true,
        initial: "San Francisco",
        placeholder: "San Francisco",
        type: "string",
      },
    },
  },
  [keys.flag_key__x_youtube_view]: {
    id: keys.flag_key__x_youtube_view,
    name: "Youtube Video",
    category: "media",
    description: <p>Embed a youtube video</p>,
    fields: {
      video: {
        required: true,
        initial: "LOZuxwVk7TU",
        placeholder: "youtube.com/watch?v=XXXXXXXXXX",
        type: "string",
      },
    },
  },
  // utils
  [keys.flag_key__autofocus]: {
    id: keys.flag_key__autofocus,
    name: "Auto focus",
    category: "utils",
    description: "Set autofocus property",
  },
  // seo
  [keys.flag_key__as_h1]: {
    id: keys.flag_key__as_h1,
    name: "Heading 1",
    category: "seo",
    description: "Set heading 1 tag",
  },
  [keys.flag_key__as_h2]: {
    id: keys.flag_key__as_h2,
    name: "Heading 2",
    category: "seo",
    description: "Set heading 2 tag",
  },
  [keys.flag_key__as_h3]: {
    id: keys.flag_key__as_h3,
    name: "Heading 3",
    category: "seo",
    description: "Set heading 3 tag",
  },
};

export default config;
