import { useState } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useReferenceGenomesQuery } from "../api";
import { useIGV } from "../context/IGVContext";
import ContainerModal from "./ContainerModal";

enum ReferenceGenomesMessages {
  LOADING = "Loading reference genomes...",
  ERROR = "Error loading reference genomes.",
  EMPTY = "No reference genomes available.",
}

function URLGenome() {
  const { getBrowser } = useIGV();
  const [refURL, setRefURL] = useState("");
  const [indexURL, setIndexURL] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLoadGenome = () =>
    getBrowser()?.loadGenome({
      fastaURL: refURL,
      ...(indexURL && { indexURL }),
    });

  return (
    <>
      <NavDropdown.Item onClick={handleShow}>URL...</NavDropdown.Item>
      <ContainerModal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Genome by URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formReferenceURL">
              <Form.Label>Reference URL [Required]</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter reference URL..."
                value={refURL}
                onChange={(e) => setRefURL(e.target.value)}
              />
              <Form.Text className="text-muted">
                URL to a reference file (.fa, .fasta).
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formIndexURL">
              <Form.Label>Index URL [Optional]</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter index URL..."
                value={indexURL}
                onChange={(e) => setIndexURL(e.target.value)}
              />
              <Form.Text className="text-muted">
                URL to an index file (.fai).
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => handleLoadGenome() && handleClose()}>
            Add Genome
          </Button>
        </Modal.Footer>
      </ContainerModal>
    </>
  );
}

function ReferenceGenomes() {
  const { getBrowser } = useIGV();
  const { data, error, isLoading } = useReferenceGenomesQuery();

  return (
    <>
      {isLoading ? (
        <NavDropdown.Item>{ReferenceGenomesMessages.LOADING}</NavDropdown.Item>
      ) : error ? (
        <NavDropdown.Item>{ReferenceGenomesMessages.ERROR}</NavDropdown.Item>
      ) : data ? (
        data.map((genome) => (
          <NavDropdown.Item
            key={genome.id}
            onClick={() => getBrowser()?.loadGenome(genome.id!)}
          >
            {genome.name}
          </NavDropdown.Item>
        ))
      ) : (
        <NavDropdown.Item>{ReferenceGenomesMessages.EMPTY}</NavDropdown.Item>
      )}
    </>
  );
}

export default function GenomesDropdown() {
  return (
    <NavDropdown title="Genome" id="genomes-dropdown">
      <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
        <NavDropdown.Header>Add a Custom Reference</NavDropdown.Header>
        <URLGenome />
        <NavDropdown.Divider />
        <NavDropdown.Header>Available References</NavDropdown.Header>
        <ReferenceGenomes />
      </div>
    </NavDropdown>
  );
}
