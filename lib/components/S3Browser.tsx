import { useState } from "react";
import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import { useHandlers } from "../context/HandlersContext";

interface S3BrowserProps {
  onChange: (path: string) => void;
}

export default function S3Browser(props: S3BrowserProps) {
  const handlers = useHandlers();
  const [path, setPath] = useState("");
  const [menuOpen, setMenuOpen] = useState<boolean | undefined>(undefined);

  async function loadOptions() {
    const paths = await handlers.getS3Paths(path);

    return paths.map((p) => {
      return {
        value: p,
        label: p,
      };
    });
  }

  function handleChange(option: SingleValue<{ value: string; label: string }>) {
    setPath(option?.value || "");
    props.onChange(option?.value || "");
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
