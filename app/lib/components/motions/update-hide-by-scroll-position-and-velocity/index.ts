import { ScrollMotionValues } from "framer-motion";

export function update_hide_by_scroll_position_and_velocity({
  scrollYProgress,
  is_animating_by_intense_scrolling,
  on_animating_by_intense_scrolling,
  on_change,
  options = {
    top_sensitivity: 0.01,
    bottom_sensitivity: 0.01,
    define_intense_velocity: 1,
  },
}: {
  scrollYProgress: ScrollMotionValues["scrollYProgress"];
  is_animating_by_intense_scrolling: boolean;
  on_animating_by_intense_scrolling: (v?: true) => void;
  on_change: (hide: boolean) => void;
  options?: {
    top_sensitivity: number;
    bottom_sensitivity: number;
    define_intense_velocity: number;
  };
}) {
  const velocity = scrollYProgress.getVelocity();
  // console.log("velocity", velocity);
  const is_intense_scrolling =
    Math.abs(velocity) > options.define_intense_velocity;
  const direction = velocity > 0 ? "down" : "up"; // this is ok. velocity can't be 0.
  const scroll_progress_percentage = scrollYProgress.get();
  if (is_intense_scrolling) {
    switch (direction) {
      // scroll intense + down = hide
      case "down":
        on_change(true);
        break;
      // scroll intense + up = show
      case "up":
        on_animating_by_intense_scrolling(true);
        on_change(false);
        break;
    }
  } else {
    if (scroll_progress_percentage <= options.top_sensitivity) {
      switch (direction) {
        // top + down = hide
        case "down":
          on_change(true);
          break;
        case "up":
          // top + up = show
          on_change(false);
          break;
      }
    } else if (scroll_progress_percentage >= 1 - options.bottom_sensitivity) {
      // bottom = show
      on_change(false);
    } else {
      if (!is_animating_by_intense_scrolling) {
        // middle = hide
        on_change(true);
      }
    }
  }
}
