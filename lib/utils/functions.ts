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
