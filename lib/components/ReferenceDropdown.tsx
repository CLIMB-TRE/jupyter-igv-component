import { useState } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useIGVReferenceGenomesQuery } from "../api";
import { RequiredBadge, OptionalBadge } from "./base/Badges";
import { DarkButton } from "./base/Buttons";
import { useIGV } from "../context/IGVContext";
import { ContainerModal } from "./base/Modals";

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
        <Modal.Header>
          <Modal.Title>Add Genome by URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formReferenceURL">
              <Form.Label>
                Reference URL <RequiredBadge />
              </Form.Label>
              <Form.Control
                required
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
              <Form.Label>
                Index URL <OptionalBadge />
              </Form.Label>
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
          <DarkButton onClick={handleClose}>Close</DarkButton>
          <DarkButton onClick={() => handleLoadGenome() && handleClose()}>
            Add Genome
          </DarkButton>
        </Modal.Footer>
      </ContainerModal>
    </>
  );
}

function ReferenceGenomes() {
  const { getBrowser } = useIGV();
  const { data, error, isLoading } = useIGVReferenceGenomesQuery();

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

export default function ReferenceDropdown() {
  return (
    <NavDropdown title="Reference" id="reference-dropdown">
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
