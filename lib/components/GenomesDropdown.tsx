import NavDropdown from "react-bootstrap/NavDropdown";
import { useReferenceGenomesQuery } from "../api";
import { useIGV } from "../context/IGVContext";

enum ReferenceGenomesMessages {
  LOADING = "Loading reference genomes...",
  ERROR = "Error loading reference genomes.",
  EMPTY = "No reference genomes available.",
}

export default function GenomesDropdown() {
  const { data, error, isLoading } = useReferenceGenomesQuery();
  const { getBrowser } = useIGV();

  return (
    <NavDropdown title="Genome" id="genomes-dropdown">
      <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
        {isLoading ? (
          <NavDropdown.Item>
            {ReferenceGenomesMessages.LOADING}
          </NavDropdown.Item>
        ) : error ? (
          <NavDropdown.Item>{ReferenceGenomesMessages.ERROR}</NavDropdown.Item>
        ) : data ? (
          data.map((genome) => (
            <NavDropdown.Item
              key={genome.id}
              onClick={() => getBrowser()?.loadGenome(genome)}
            >
              {genome.name}
            </NavDropdown.Item>
          ))
        ) : (
          <NavDropdown.Item>{ReferenceGenomesMessages.EMPTY}</NavDropdown.Item>
        )}
      </div>
    </NavDropdown>
  );
}
