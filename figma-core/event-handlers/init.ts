import { __register__ as __register_create_icon__ } from "./create-icon";
import { __register__ as __register_create_image__ } from "./apply-image";
import { __register__ as __register_replace_text_characters__ } from "./apply-text-characters";
import { __register__ as __register_replace_font__ } from "./replace-font";
import { __register__ as __register_hide_all__ } from "./hide-all";
import { __register__ as __register_randomize_selection__ } from "./randomize-selection";
//
__register_create_icon__();
__register_create_image__();
__register_replace_text_characters__();
__register_replace_font__();
__register_hide_all__();
__register_randomize_selection__();

// disabled for build size optimization. re-enable after migrating seed data on web side.
// import { __register__ as __register_create_button__ } from "./create-button";
// __register_create_button__();
