export const size = {
  medium: "800px",
  large: "1280px",
  xlarge: "1550px",
  xxlarge: "1680px",
};

export const mediaQuery = {
  small: `@media (max-width: ${size.medium})`,
  medium: `@media (max-width: ${size.large}) and (min-width: ${size.medium})`,
  large: `@media (max-width: ${size.xlarge}) and (min-width: ${size.large})`,
  xlarge: `@media (min-width: ${size.xlarge})`,
};
