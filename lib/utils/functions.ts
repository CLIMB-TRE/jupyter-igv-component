import { Browser } from "igv";
import { JupyterIGVProps } from "../interfaces";

/* Sets the document title using the provided handler and the genome ID from the IGV browser instance. */
export function setTitleAsReference(
  handlers: JupyterIGVProps,
  browser: Browser
) {
  if (handlers.setTitle) {
    // @ts-expect-error This property is on the browser
    const genomeID = browser.genome.id;
    handlers.setTitle(`IGV | ${genomeID}`);
  }
}

export function getS3URI(uri: string) {
  return uri.startsWith("s3://") ? uri : `s3://${uri}`;
}

export function parseS3URL(urlStr: string): string {
  let bucket = "";
  let key = "";
  const url = new URL(urlStr);

  if (url.protocol === "s3:") {
    bucket = url.hostname;
    key = url.pathname.replace(/^\//, "");
  } else {
    // Virtual-hosted: bucket.s3.amazonaws.com (index 1)
    // Path-style: s3.amazonaws.com/bucket (index 0)
    const hostParts = url.hostname.split(".");
    const pathParts = url.pathname.split("/").filter((p) => p);
    const s3Index = hostParts.findIndex(
      (p) => p === "s3" || p.startsWith("s3-")
    );

    if (s3Index > 0) {
      // Virtual-hosted
      bucket = hostParts.slice(0, s3Index).join(".");
      key = url.pathname.substring(1); // Remove leading slash
    } else {
      // Path-style
      bucket = pathParts[0] || "";
      key = pathParts.slice(1).join("/");
    }
  }

  return `s3://${bucket}/${key}`;
}
