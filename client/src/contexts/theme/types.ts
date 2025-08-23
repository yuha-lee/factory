export interface Theme {
  colors: {
    [key: string]: string;
  };
  spacing: {
    [key: string]: number;
  };
  typography: {
    [key: string]: any;
  };
  borderRadius: {
    [key: string]: any;
  };
  shadows: {
    [key: string]: any;
  };
}
