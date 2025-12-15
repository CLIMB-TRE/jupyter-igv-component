export const version = "";

export function getItem(key: string) {
  try {
    const itemKey = `jupyter-igv-${key}`;
    const item = sessionStorage.getItem(itemKey);
    console.log("Retrieving item from sessionStorage:", itemKey, item);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    console.error("Error reading from sessionStorage", error);
  }
}

export function setItem(key: string, value: unknown) {
  try {
    const itemKey = `jupyter-igv-${key}`;
    sessionStorage.setItem(itemKey, JSON.stringify(value));
    console.log("Saving item to sessionStorage:", itemKey, value);
  } catch (error) {
    console.error("Error saving to sessionStorage", error);
  }
}

export function setTitle(title: string) {
  document.title = title;
}

export async function s3PresignHandler(uri: string): Promise<string> {
  // Test references and annotations
  const URLS = [
    "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg38/hg38.fa",
    "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg38/hg38.fa.fai",
    "https://s3.amazonaws.com/igv.org.genomes/hg38/refGene.txt.gz",
  ];

  // Simulate network delay
  console.log(`Presigning ${uri}`);
  await new Promise((resolve) => setTimeout(resolve, 200));
  const url = `https://s3.amazonaws.com/${uri.slice(5)}`;

  // Validate URL
  if (!URLS.includes(url)) {
    throw new Error(`Error occurred: ${url}`);
  }

  return url;
}
