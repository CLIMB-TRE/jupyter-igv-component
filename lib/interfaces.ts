export interface JupyterIGVProps {
  version: string;
  getItem?: (key: string) => unknown;
  setItem?: (key: string, value: unknown) => void;
  setTitle?: (title: string) => void;
  getS3Paths: (path: string) => Promise<string[]>;
}
