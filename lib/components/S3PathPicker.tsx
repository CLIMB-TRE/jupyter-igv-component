import { useState } from "react";
import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";

const DUMMY_S3 = [
  "my-bucket/",
  "my-bucket/folder1",
  "my-bucket/folder1/file1.txt",
  "my-bucket/folder1/file2.csv",
  "my-bucket/folder2",
  "my-bucket/folder2/subfolder1",
  "my-bucket/folder2/subfolder1/data.json",
  "another-bucket/",
  "another-bucket/photos",
  "another-bucket/photos/cat.jpg",
  "another-bucket/photos/dog.png",
];

async function fetchS3Paths(path: string): Promise<string[]> {
  await new Promise((res) => setTimeout(res, 200)); // Simulate network delay

  const matches = DUMMY_S3.filter((p) => p.startsWith(path));
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

export default function S3PathPicker({
  onChange,
}: {
  onChange: (s3Path: string) => void;
}) {
  const [path, setPath] = useState("");
  const [menuOpen, setMenuOpen] = useState<boolean | undefined>(undefined);

  async function loadOptions() {
    const paths = await fetchS3Paths(path);

    return paths.map((p) => {
      return {
        value: p,
        label: p,
      };
    });
  }

  function handleChange(option: SingleValue<{ value: string; label: string }>) {
    setPath(option?.value || "");
    onChange(option?.value || "");
    if (option?.value.endsWith("/")) setMenuOpen(true);
    else setMenuOpen(false);
  }

  return (
    <AsyncSelect
      key={path}
      placeholder="Select S3 path..."
      value={path ? { value: path, label: path } : null}
      onChange={handleChange}
      loadOptions={loadOptions}
      cacheOptions
      defaultOptions
      isClearable
      isSearchable={false}
      menuIsOpen={menuOpen}
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
    />
  );
}
