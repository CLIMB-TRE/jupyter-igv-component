import { useState } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIGVReferencesQuery } from "../api";
import { RequiredBadge, OptionalBadge } from "./base/Badges";
import { DarkButton } from "./base/Buttons";
import { ContainerModal } from "./base/Modals";
import { useIGV } from "../context/IGVContext";
import { useHandlers } from "../context/HandlersContext";

enum IGVReferencesMessage {
  LOADING = "Loading reference genomes...",
  ERROR = "Error loading reference genomes.",
  EMPTY = "No reference genomes available.",
}

type CustomReferenceForm = {
  referenceURI: string;
  indexURI?: string;
};

const S3_URI_REGEX = /^s3:\/\/([a-z0-9.-]{1,})\/.*$/;
const S3_URI_MESSAGE =
  "Must be a valid S3 URI starting with 's3://' and including a bucket/key.";
const s3URI = z.string().regex(S3_URI_REGEX, {
  message: S3_URI_MESSAGE,
});

const CustomReferenceSchema = z.object({
  referenceURI: s3URI,
  indexURI: z.union([s3URI, z.literal("")]).optional(),
});

function CustomReference() {
  const igvContext = useIGV();
  const handlers = useHandlers();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CustomReferenceSchema),
  });

  const onSubmit: SubmitHandler<CustomReferenceForm> = async (data) => {
    const [presignedFastaURL, presignedIndexURL] = await Promise.all([
      handlers.s3PresignHandler(data.referenceURI),
      data.indexURI
        ? handlers.s3PresignHandler(data.indexURI)
        : Promise.resolve(undefined),
    ]);
    await igvContext.getBrowser()?.loadGenome({
      fastaURL: presignedFastaURL,
      indexURL: presignedIndexURL,
    });
    handleClose();
  };

  return (
    <>
      <NavDropdown.Item onClick={handleShow}>S3 URI...</NavDropdown.Item>
      <ContainerModal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <Modal.Title>Add Reference by S3 URI</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                Reference S3 URI <RequiredBadge />
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter reference URI..."
                isInvalid={!!errors.referenceURI}
                {...register("referenceURI")}
              />
              <Form.Text className="text-muted">
                S3 URI to a reference file (.fa, .fasta).
              </Form.Text>
              <div className="small text-danger">
                {errors.referenceURI?.message}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Index S3 URI <OptionalBadge />
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter index URI..."
                isInvalid={!!errors.indexURI}
                {...register("indexURI")}
              />
              <Form.Text className="text-muted">
                S3 URI to an index file (.fai).
              </Form.Text>
              <div className="small text-danger">
                {errors.indexURI?.message}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <DarkButton onClick={handleClose}>Close</DarkButton>
            <DarkButton type="submit">Add Reference</DarkButton>
          </Modal.Footer>
        </Form>
      </ContainerModal>
    </>
  );
}

function IGVReferences() {
  const igvContext = useIGV();
  const { data, error, isLoading } = useIGVReferencesQuery();

  return (
    <>
      {isLoading ? (
        <NavDropdown.Item>{IGVReferencesMessage.LOADING}</NavDropdown.Item>
      ) : error ? (
        <NavDropdown.Item>{IGVReferencesMessage.ERROR}</NavDropdown.Item>
      ) : data ? (
        data.map((genome) => (
          <NavDropdown.Item
            key={genome.id}
            onClick={() => igvContext.getBrowser()?.loadGenome(genome.id!)}
          >
            {genome.name}
          </NavDropdown.Item>
        ))
      ) : (
        <NavDropdown.Item>{IGVReferencesMessage.EMPTY}</NavDropdown.Item>
      )}
    </>
  );
}

export default function ReferenceDropdown() {
  return (
    <NavDropdown title="Reference" id="reference-dropdown">
      <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
        <NavDropdown.Header>Add a Custom Reference</NavDropdown.Header>
        <CustomReference />
        <NavDropdown.Divider />
        <NavDropdown.Header>Available References</NavDropdown.Header>
        <IGVReferences />
      </div>
    </NavDropdown>
  );
}
