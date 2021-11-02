import React, { useEffect } from "react";
import { motion } from "framer-motion";

type AnimationState = "normal" | "disconnected" | "selected";
const booster_animation_duration = 0.8;

export function InteractiveIndicator({ size }: { size: number }) {
  const [animation, setAnimation] = React.useState<AnimationState>("normal");

  useEffect(() => {
    const evl = (ev) => {
      const message = ev.data.pluginMessage;
      if (message?.type == "selectionchange") {
        // trigger boost animation

        setTimeout(() => {
          setAnimation("normal");
        }, booster_animation_duration * 1000);
        setAnimation("selected");
      }
    };

    window.addEventListener("message", evl);

    return () => {
      window.removeEventListener("message", evl);
    };
  }, []);

  const animations = {
    normal: {
      scale: 2.5,
      opacity: 0,
    },
    selected: {
      scale: 4,
      opacity: 0,
    },
  };

  const Outer = ({
    delay,
    type = "normal",
  }: {
    delay?;
    type?: AnimationState;
  }) => {
    const dur = type == "selected" ? booster_animation_duration : 2;
    return (
      <motion.div
        style={{
          position: "absolute",
          background: "blue",
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: 0.5,
          scale: 0,
        }}
        animate={animations[type]}
        transition={{ repeat: Infinity, duration: dur, delay: delay }}
      />
    );
  };
  return (
    <div
      style={{
        position: "relative",
        left: -size / 2,
        top: -size / 2,
      }}
    >
      <Outer type={animation} />
      <Outer delay={1} type={animation} />
      <motion.div
        style={{
          position: "absolute",
          background: "blue",
          width: size,
          height: size,
          opacity: 1,
          borderRadius: size / 2,
        }}
        animate={{
          scale: [1, 0.5, 1],
        }}
        transition={{ repeat: Infinity, duration: 2, type: "spring" }}
      />
    </div>
  );
}
