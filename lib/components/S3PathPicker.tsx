import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Dropdown, Spinner, Button } from "react-bootstrap";

// Dummy dataset (simulate your S3 buckets/objects)
const DUMMY_S3 = [
  "my-bucket/",
  "my-bucket/folder1/",
  "my-bucket/folder1/file1.txt",
  "my-bucket/folder1/file2.csv",
  "my-bucket/folder2/",
  "my-bucket/folder2/subfolder1/",
  "my-bucket/folder2/subfolder1/data.json",
  "another-bucket/",
  "another-bucket/photos/",
  "another-bucket/photos/cat.jpg",
  "another-bucket/photos/dog.png",
];

// Dummy fetch function
async function fetchS3Listing(prefix = "") {
  // simulate network delay
  await new Promise((res) => setTimeout(res, 300));

  // Filter dataset by prefix
  const matches = DUMMY_S3.filter((item) => item.startsWith(prefix));

  // Strip prefix so we only return the next "level"
  const nextLevel = new Set();
  const objects = [];

  for (const match of matches) {
    const remainder = match.slice(prefix.length);
    if (!remainder) continue;

    const slashIndex = remainder.indexOf("/");
    if (slashIndex !== -1) {
      // It's a folder
      nextLevel.add(remainder.slice(0, slashIndex + 1));
    } else {
      // It's a file
      objects.push(remainder);
    }
  }

  return {
    prefixes: [...nextLevel],
    objects,
  };
}

export default function S3PathPicker({ onSelect }) {
  const [prefixStack, setPrefixStack] = useState([""]); // e.g. ["my-bucket/", "folder1/"]

  const currentPrefix = prefixStack.join("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["s3", currentPrefix],
    queryFn: () => fetchS3Listing(currentPrefix),
    enabled: true,
  });

  function handleSelect(value) {
    setPrefixStack((prev) => [...prev, value]);
  }

  function handleBreadcrumbClick(idx) {
    setPrefixStack((prev) => prev.slice(0, idx + 1));
  }

  function handleConfirm() {
    onSelect(prefixStack.join(""));
  }

  return (
    <div>
      {/* Breadcrumb navigation */}
      <Breadcrumb>
        {prefixStack.map((p, idx) => (
          <Breadcrumb.Item
            key={idx}
            active={idx === prefixStack.length - 1}
            onClick={() => handleBreadcrumbClick(idx)}
          >
            {p === "" ? "root" : p}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>

      {/* Dropdown for next selection */}
      <Dropdown>
        <Dropdown.Toggle
          variant="primary"
          id="dropdown-basic"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Loading...
            </>
          ) : (
            "Select next"
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {isError && (
            <Dropdown.Item disabled>Error loading data</Dropdown.Item>
          )}
          {data?.prefixes?.map((p) => (
            <Dropdown.Item key={p} onClick={() => handleSelect(p)}>
              📁 {p}
            </Dropdown.Item>
          ))}
          {data?.objects?.map((o) => (
            <Dropdown.Item key={o} onClick={() => handleSelect(o)}>
              📄 {o}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Confirm button */}
      {prefixStack.length > 1 && (
        <div className="mt-3">
          <Button onClick={handleConfirm} variant="success">
            Confirm Path
          </Button>
        </div>
      )}
    </div>
  );
}
