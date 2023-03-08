import React, { useMemo } from "react";
import styled from "@emotion/styled";
import gradient from "gradient-parser";

export function ColorChip({
  color,
  ...props
}: {
  color: React.CSSProperties["color"];
}) {
  const colors = useMemo(() => gradient_colors(color), [color]);
  const type: "color" | "gradient" = colors.length > 1 ? "gradient" : "color";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {type === "gradient" ? (
        <>
          <Chip
            {...props}
            style={{
              background: color,
            }}
          />
          <Chips>
            {colors.map((c, i) => (
              <Chip
                title={c}
                className="small"
                key={i}
                {...props}
                style={{
                  background: c,
                }}
              />
            ))}
          </Chips>
        </>
      ) : (
        <>
          <Chip
            style={{
              background: color,
            }}
          />
          <ColorCaption>{color}</ColorCaption>
        </>
      )}
    </div>
  );
}

const Chips = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  padding: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const Chip = styled.div`
  margin: 4px;
  width: 64px;
  height: 64px;
  border-radius: 8px;

  &.small {
    width: 32px;
    height: 32px;
  }
`;

const ColorCaption = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 2px;
`;

function gradient_colors(color: string) {
  const colors = [];

  if (color.includes("gradient")) {
    let gradients: gradient.GradientNode[];
    try {
      gradients = gradient.parse(color);
    } catch (e) {
      return [];
    }
    gradients.map((g) => {
      g.colorStops.map((c) => {
        let value = c.value;
        switch (c.type) {
          case "hex": {
            value = `#${c.value}`;
            break;
          }
          case "rgba":
          case "rgb": {
            c.value[3] = c.value[3] ? c.value[3] : "255"; // fill alpha
            value = `rgba(${c.value.join(",")})`;
            break;
          }
          case "literal": {
            value = c.value;
            break;
          }
        }
        colors.push(value);
      });
    });
  } else {
    // if non-gradient, just return the color wrapped in arrray
    return [color];
  }

  return colors;
}
