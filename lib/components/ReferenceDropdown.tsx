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
import ErrorModal from "./ErrorModal";
import { useIGVBrowser } from "../context/IGVBrowser";
import { useHandlers } from "../context/Handlers";
import { s3URI } from "../utils/validators";
import { setTitleAsReference } from "../utils/functions";

enum IGVReferencesMessage {
  LOADING = "Loading reference genomes...",
  ERROR = "Error loading reference genomes.",
  EMPTY = "No reference genomes available.",
}

type ReferenceForm = {
  referenceURI: string;
  indexURI?: string;
};

const ReferenceSchema = z.object({
  referenceURI: s3URI,
  indexURI: z.union([s3URI, z.literal("")]).optional(),
});

export default function ReferenceDropdown() {
  const handlers = useHandlers();
  const igvBrowser = useIGVBrowser();

  // IGV References
  const {
    data: igvRefs,
    error: igvRefsError,
    isLoading: isIGVRefsLoading,
  } = useIGVReferencesQuery();

  // Custom Reference
  const [showRefModal, setShowRefModal] = useState(false);
  const [refError, setRefError] = useState<Error | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const handleRefError = (e: Error) => {
    setRefError(e);
    setShowErrorModal(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ReferenceSchema),
  });

  const onRefSubmit: SubmitHandler<ReferenceForm> = async (data) => {
    await Promise.all([
      handlers.s3PresignHandler(data.referenceURI),
      data.indexURI
        ? handlers.s3PresignHandler(data.indexURI)
        : Promise.resolve(undefined),
    ])
      .then(([presignedFastaURL, presignedIndexURL]) => {
        const browser = igvBrowser.getBrowser();
        browser
          ?.loadGenome({
            fastaURL: presignedFastaURL,
            indexURL: presignedIndexURL,
          })
          .then(() => {
            igvBrowser.saveBrowser(browser);
            setTitleAsReference(handlers, browser);
          })
          .catch(handleRefError);
      })
      .catch(handleRefError);
    setShowRefModal(false);
  };

  return (
    <>
      <NavDropdown
        title="Reference"
        id="reference-dropdown"
        disabled={!handlers.enabled}
      >
        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          <NavDropdown.Header>Add a Reference</NavDropdown.Header>
          <NavDropdown.Item onClick={() => setShowRefModal(true)}>
            S3 URI...
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Header>IGV References</NavDropdown.Header>
          {isIGVRefsLoading ? (
            <NavDropdown.Item>{IGVReferencesMessage.LOADING}</NavDropdown.Item>
          ) : igvRefsError ? (
            <NavDropdown.Item>{IGVReferencesMessage.ERROR}</NavDropdown.Item>
          ) : igvRefs ? (
            igvRefs.map((genome) => (
              <NavDropdown.Item
                key={genome.id}
                onClick={() => {
                  const browser = igvBrowser.getBrowser();
                  browser?.loadGenome(genome.id!).then(() => {
                    igvBrowser.saveBrowser(browser);
                    setTitleAsReference(handlers, browser);
                  });
                }}
              >
                {genome.name}
              </NavDropdown.Item>
            ))
          ) : (
            <NavDropdown.Item>{IGVReferencesMessage.EMPTY}</NavDropdown.Item>
          )}
        </div>
      </NavDropdown>
      <ErrorModal
        title="Reference Error"
        error={refError}
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
      />
      <ContainerModal show={showRefModal} onHide={() => setShowRefModal(false)}>
        <Form onSubmit={handleSubmit(onRefSubmit)}>
          <Modal.Header>
            <Modal.Title>Add Reference</Modal.Title>
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
            <DarkButton onClick={() => setShowRefModal(false)}>
              Close
            </DarkButton>
            <DarkButton type="submit">Add Reference</DarkButton>
          </Modal.Footer>
        </Form>
      </ContainerModal>
    </>
  );
}
