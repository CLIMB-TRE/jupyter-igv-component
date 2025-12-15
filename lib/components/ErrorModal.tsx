import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { ContainerModal } from "./base/Modals.tsx";
import { DarkButton } from "./base/Buttons.tsx";

interface ErrorModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  error: Error | null;
}

function ErrorModal(props: ErrorModalProps) {
  return (
    <ContainerModal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton className="px-4">
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="d-flex justify-content-center">
              Error Occurred.
            </Form.Label>
            <Form.Text className="d-flex justify-content-center">
              Please try again or contact CLIMB-TRE support if the problem
              persists.
            </Form.Text>
          </Form.Group>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>View Error Message</Accordion.Header>
              <Accordion.Body>
                <small className="text-danger font-monospace">
                  {props.error
                    ? `${props.error.name}: ${props.error.message}`
                    : "No error message."}
                </small>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <DarkButton onClick={props.onHide}>Close</DarkButton>
      </Modal.Footer>
    </ContainerModal>
  );
}

export default ErrorModal;
