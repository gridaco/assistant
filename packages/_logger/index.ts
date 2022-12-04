export class Logger {
  constructor(readonly namespace: string) {}

  /**
   * log sequence
   */
  log_s() {
    throw "not implemnted";
  }
  static debug(message?: any, ...optionalParams: any[]) {
    if (process.env.NODE_ENV == "development") {
      console.log(message, optionalParams);
    }
  }
  static info(message?: any, ...optionalParams: any[]) {
    console.info(message, optionalParams);
  }
  static warn(message?: any, ...optionalParams: any[]) {
    console.warn(message, optionalParams);
  }
  static error(message?: any, ...optionalParams: any[]) {
    console.error(message, optionalParams);
  }
  static log(message?: any, ...optionalParams: any[]) {
    console.log(message, optionalParams);
  }
}
