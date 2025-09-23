export interface JupyterIGVProps {
  httpPathHandler: (path: string) => Promise<Response>;
  s3PathHandler: (path: string) => Promise<void>;
  fileWriter: (path: string, content: string) => Promise<void>;
  extVersion: string;
  getItem?: (key: string) => unknown;
  setItem?: (key: string, value: unknown) => void;
  setTitle?: (title: string) => void;
}
