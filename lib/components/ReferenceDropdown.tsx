import { useState } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIGVReferencesQuery } from "../api";
import { DarkButton } from "./base/Buttons";
import { ContainerModal } from "./base/Modals";
import { FormField } from "./base/Forms";
import ErrorModal from "./ErrorModal";
import { useIGVBrowser } from "../context/IGVBrowser";
import { useHandlers } from "../context/Handlers";
import { s3URI } from "../utils/validators";
import { getS3URI, setTitleAsReference } from "../utils/functions";

enum IGVReferencesMessage {
  LOADING = "Loading reference genomes...",
  ERROR = "Error loading reference genomes.",
  EMPTY = "No reference genomes available.",
}

type ReferenceForm = {
  name: string;
  referenceURI: string;
  indexURI?: string;
};

const ReferenceSchema = z.object({
  name: z.string().min(3),
  referenceURI: s3URI,
  indexURI: z.union([s3URI, z.literal("")]),
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
      handlers.s3PresignHandler(getS3URI(data.referenceURI)),
      data.indexURI
        ? handlers.s3PresignHandler(getS3URI(data.indexURI))
        : Promise.resolve(undefined),
    ])
      .then(([presignedFastaURL, presignedIndexURL]) => {
        const browser = igvBrowser.getBrowser();
        browser
          ?.loadGenome({
            id: data.name,
            name: data.name,
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
            <FormField
              name="name"
              title="Reference Name"
              placeholder="Enter reference name..."
              description="The display name for the reference."
              required={true}
              errors={errors}
              register={register("name")}
            />
            <FormField
              name="referenceURI"
              title="Reference S3 URI"
              placeholder="Enter reference URI..."
              description="S3 URI to a reference file (.fa, .fasta)."
              required={true}
              errors={errors}
              register={register("referenceURI")}
              prefix="s3://"
            />
            <FormField
              name="indexURI"
              title="Index S3 URI"
              placeholder="Enter index URI..."
              description="S3 URI to an index file (.fai)."
              required={false}
              errors={errors}
              register={register("indexURI")}
              prefix="s3://"
            />
            <small className="text-muted">
              Note: IGV will <b>not</b> auto-detect indexes. To use an index, it{" "}
              <b>must</b> be provided in the above field.
            </small>
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
