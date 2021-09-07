export function paragraph(t: string) {
  return t;
}

export function quote(t: string) {
  return `<blockquote>${t}</blockquote>`;
}

export function inlineCode(t: string) {
  return `<code>${t}</code>`;
}

export function h1(t: string) {
  return `<h1>${t}</h1>`;
}

export function h2(t: string) {
  return `<h2>${t}</h2>`;
}

export function h3(t: string) {
  return `<h3>${t}</h3>`;
}

export function h4(t: string) {
  return `<h4>${t}</h4>`;
}

export function h5(t: string) {
  return `<h5>${t}</h5>`;
}

export function h6(t: string) {
  return `<h6>${t}</h6>`;
}

export function unknown(t: string) {
  return comment(`unknown text provided >>> ` + t);
}

export function comment(t: string) {
  return `<!-- ${t} -->`;
}
