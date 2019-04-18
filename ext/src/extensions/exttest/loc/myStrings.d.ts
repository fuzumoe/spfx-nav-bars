declare interface IExttestCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'ExttestCommandSetStrings' {
  const strings: IExttestCommandSetStrings;
  export = strings;
}
