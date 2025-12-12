export interface JupyterIGVProps {
  version: string;
  s3PresignHandler: (uri: string) => Promise<string>;
  getItem?: (key: string) => unknown;
  setItem?: (key: string, value: unknown) => void;
  setTitle?: (title: string) => void;
}
