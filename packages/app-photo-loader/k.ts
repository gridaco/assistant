const __query_placeholders = [
  `Try "An astronaut with cowboy hat"`,
  `Try "Abstract geometric 3D shapes"`,
  `Try "Background"`,
  `Try "Futuristic cityscape with flying cars and towering skyscrapers"`,
  `Try "magical forest with towering trees and a gentle stream running through it."`,
  `Try "Cozy cabin with fire and snow"`,
  `Try "Bustling marketplace with stalls and people"`,
  `Try "An enchanted forest filled with fireflies."`,
  `Try "A quaint village nestled in the countryside"`,
  `Try "A breathtaking mountain range at sunrise"`,
  `Try "A mysterious island shrouded in mist"`,
  `Try "A vibrant marketplace in a bustling city"`,
];
export const radmon_query_placeholder = () => {
  const i = Math.floor(Math.random() * __query_placeholders.length);
  return __query_placeholders[i];
};
