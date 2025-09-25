import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useIGV } from "../context/IGVContext";
import { ContainerModal } from "./base/Modals";
import NavDropdown from "react-bootstrap/NavDropdown";
import { RequiredBadge, OptionalBadge } from "./base/Badges";
import { DarkButton } from "./base/Buttons";
import { TrackLoad, TrackType } from "igv";

function Track() {
  const { getBrowser } = useIGV();
  const [name, setName] = useState("");
  const [url, setURL] = useState("");
  const [indexURL, setIndexURL] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLoadTrack = () =>
    getBrowser()?.loadTrack({
      name: name,
      url: url,
      ...(indexURL && { indexURL }),
    } as unknown as TrackLoad<TrackType>);

  return (
    <>
      <NavDropdown.Item onClick={handleShow}>URL...</NavDropdown.Item>
      <ContainerModal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Add Track</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTrackName">
              <Form.Label>
                Track Name <RequiredBadge />
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter track name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Text className="text-muted">
                The display name for the track.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTrackURL">
              <Form.Label>
                Track URL <RequiredBadge />
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter track URL..."
                value={url}
                onChange={(e) => setURL(e.target.value)}
              />
              <Form.Text className="text-muted">
                URL to the track resource, such as a file or webservice, or a
                data URI.
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
                URL to a file index, such as a BAM .bai, tabix .tbi, or tribble
                .idx file.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <DarkButton onClick={handleClose}>Close</DarkButton>
          <DarkButton onClick={() => handleLoadTrack() && handleClose()}>
            Add Track
          </DarkButton>
        </Modal.Footer>
      </ContainerModal>
    </>
  );
}

export default function TracksDropdown() {
  return (
    <NavDropdown title="Tracks" id="tracks-dropdown">
      <NavDropdown.Header>Add a Track</NavDropdown.Header>
      <Track />
    </NavDropdown>
  );
}
