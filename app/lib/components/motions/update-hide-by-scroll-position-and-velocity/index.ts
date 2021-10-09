import { ScrollMotionValues } from "framer-motion";

export function update_hide_by_scroll_position_and_velocity({
  scrollYProgress,
  is_animating_by_intense_scrolling,
  on_animating_by_intense_scrolling,
  on_change,
}: {
  scrollYProgress: ScrollMotionValues["scrollYProgress"];
  is_animating_by_intense_scrolling: boolean;
  on_animating_by_intense_scrolling: (v?: true) => void;
  on_change: (hide: boolean) => void;
}) {
  const velocity = scrollYProgress.getVelocity();
  const is_intense_scrolling = Math.abs(velocity * 10) > 2;
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
    if (scroll_progress_percentage <= 0.05) {
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
    } else if (scroll_progress_percentage >= 0.95) {
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
