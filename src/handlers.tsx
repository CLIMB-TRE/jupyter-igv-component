function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function httpPathHandler(path: string) {
  const domain = "";
  const token = "";
  return fetch(domain + path, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function s3PathHandler(path: string) {
  return delay(1000).then(() => {
    console.log("Opening S3 file:", path);
  });
}

export async function fileWriter(path: string, content: string) {
  return delay(1000).then(() => {
    console.log("Writing file:", path);
    console.log("Content:", content);
  });
}

export const extVersion = "";

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
