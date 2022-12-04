const __ExampleComponentDataSource = require("./mock-data-example.json");

type ImageUri = string;
type ImageBase64 = string;
type ImageString = ImageUri | ImageBase64;
type EmailString = string;

export interface __ExampleComponentProps {
  title: string;
  description: string;
  email: EmailString;
  avatar: ImageString;
}

export class ExampleDataMapperMockDataSource<T = __ExampleComponentProps> {
  rowsCount: number;
  data: T[];

  constructor() {
    this.data = __ExampleComponentDataSource;
    this.rowsCount = this.data.length;
  }

  getSingleRandom(): T {
    return getrandom<T>(this.data);
  }
}

function getrandom<T = any>(items: T[]): T {
  const item = items[Math.floor(Math.random() * items.length)];
  return item;
}
