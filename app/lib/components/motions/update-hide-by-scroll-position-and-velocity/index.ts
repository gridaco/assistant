import { useState, useEffect, RefObject } from "react";
import { ScrollMotionValues } from "framer-motion";
import { useElementScroll } from "framer-motion";

export function update_hide_by_scroll_position_and_velocity({
  scrollY,
  scrollYProgress,
  is_animating_by_intense_scrolling,
  on_animating_by_intense_scrolling,
  on_change,
  options = {
    top_sensitivity: 0.01,
    bottom_sensitivity: 0.01,
    define_intense_velocity: 1,
    do_show_on_bottom_hit: true,
  },
}: {
  scrollY: ScrollMotionValues["scrollY"];
  scrollYProgress: ScrollMotionValues["scrollYProgress"];
  is_animating_by_intense_scrolling: boolean;
  on_animating_by_intense_scrolling: (v?: true) => void;
  on_change: (hide: boolean) => void;
  options?: {
    top_sensitivity: number;
    bottom_sensitivity: number;
    define_intense_velocity: number;
    do_show_on_bottom_hit: boolean;
  };
}) {
  const scroll_progress_percentage = scrollYProgress.get();
  const ydiff = Math.abs(scrollY.get() - scrollY.getPrevious());
  if (
    // don't execute if diff is `<=` than 2. - this is a really small scroll
    ydiff <= 2 &&
    // except for bottom / top
    scroll_progress_percentage !== 0 &&
    scroll_progress_percentage !== 1
  ) {
    return;
  }

  const velocity = scrollYProgress.getVelocity();
  const velocity_abs = Math.abs(velocity);
  if (
    // if < 20, this event is not triggered by human, or caused by extremely short scroll area, causing high velocity.
    velocity_abs > 20 ||
    scrollYProgress.get() == scrollYProgress.getPrevious()
  ) {
    return;
  }
  const is_intense_scrolling = velocity_abs > options.define_intense_velocity;
  const direction = velocity > 0 ? "down" : "up"; // this is ok. velocity can't be 0.

  if (scroll_progress_percentage >= 1 - options.bottom_sensitivity) {
    if (options.do_show_on_bottom_hit) {
      // bottom = show
      on_change(false);
    }
  } else if (scroll_progress_percentage <= options.top_sensitivity) {
    switch (direction) {
      // top + down = hide
      case "down":
        if (!is_intense_scrolling) {
          on_change(true);
        }
        break;
      case "up":
        // top + up = show
        on_change(false);
        break;
    }
  } else {
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
      if (!is_animating_by_intense_scrolling) {
        // middle = hide
        on_change(true);
      }
    }
  }
}

export function useScrollTriggeredAnimation(el: RefObject<HTMLElement>) {
  const { scrollYProgress, scrollY } = useElementScroll(el);
  const [hide, setHide] = useState(false);
  let is_animating_by_intense_scrolling = false;
  useEffect(() => {
    return scrollYProgress.onChange(() =>
      update_hide_by_scroll_position_and_velocity({
        scrollYProgress,
        scrollY,
        is_animating_by_intense_scrolling,
        on_animating_by_intense_scrolling: () => {
          is_animating_by_intense_scrolling = true;
        },
        on_change: (hide) => {
          setHide(hide);
        },
        options: {
          do_show_on_bottom_hit: false,
          top_sensitivity: 0.05,
          bottom_sensitivity: 0.1,
          define_intense_velocity: 50,
        },
      })
    );
  });

  return hide;
}
