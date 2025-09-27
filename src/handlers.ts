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

export async function getS3Paths(path: string): Promise<string[]> {
  const S3 = [
    "my-bucket/folder1",
    "my-bucket/folder1/file1.txt",
    "my-bucket/folder1/file2.csv",
    "my-bucket/folder2",
    "my-bucket/folder2/subfolder1",
    "my-bucket/folder2/subfolder1/data.json",
    "another-bucket/photos",
    "another-bucket/photos/cat.jpg",
    "another-bucket/photos/dog.png",
  ];

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const matches = S3.filter((p) => p.startsWith(path));
  const paths = new Set<string>();
  const parentDir = path.split("/").filter((p) => !!p);

  for (const match of matches) {
    paths.add(
      match
        .split("/")
        .slice(0, parentDir.length + 1)
        .join("/")
        .concat(match.split("/").length > parentDir.length + 1 ? "/" : "")
    );
  }

  return [...paths];
}
