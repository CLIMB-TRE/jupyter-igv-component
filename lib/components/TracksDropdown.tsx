import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ContainerModal } from "./base/Modals";
import NavDropdown from "react-bootstrap/NavDropdown";
import { DarkButton } from "./base/Buttons";
import { FormField } from "./base/Forms";
import { TrackLoad, TrackType } from "igv";
import { useIGVBrowser } from "../context/IGVBrowser";
import { useHandlers } from "../context/Handlers";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { s3URI } from "../utils/validators";
import { getS3URI } from "../utils/functions";
import ErrorModal from "./ErrorModal";

type TrackForm = {
  name: string;
  trackURI: string;
  indexURI?: string;
};

const TrackSchema = z
  .object({
    name: z.string().min(3),
    trackURI: s3URI,
    indexURI: z.union([s3URI, z.literal("")]),
  })
  .refine(
    (data) => {
      const EXTENSIONS = [
        ".bam",
        ".cram",
        ".vcf.gz",
        ".bcf",
        ".bed.gz",
        ".gtf.gz",
        ".gff.gz",
        ".gff3.gz",
      ];
      return (
        !EXTENSIONS.some((ext) => data.trackURI.endsWith(ext)) ||
        !!data.indexURI
      );
    },
    {
      error: "An index must be provided for this file type.",
      path: ["indexURI"],
    }
  );

export default function TracksDropdown() {
  const handlers = useHandlers();
  const igvBrowser = useIGVBrowser();

  // Custom Track
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackError, setTrackError] = useState<Error | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const handleTrackError = (e: Error) => {
    setTrackError(e);
    setShowErrorModal(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TrackSchema),
  });

  const onTrackSubmit: SubmitHandler<TrackForm> = async (data) => {
    await Promise.all([
      handlers.s3PresignHandler(getS3URI(data.trackURI)),
      data.indexURI
        ? handlers.s3PresignHandler(getS3URI(data.indexURI))
        : Promise.resolve(undefined),
    ])
      .then(([presignedTrackURL, presignedIndexURL]) => {
        const browser = igvBrowser.getBrowser();
        browser
          ?.loadTrack({
            name: data.name,
            url: presignedTrackURL,
            indexURL: presignedIndexURL,
            indexed: !!presignedIndexURL,
          } as TrackLoad<TrackType>)
          .then(() => igvBrowser.saveBrowser(browser))
          .catch(handleTrackError);
      })
      .catch(handleTrackError);
    setShowTrackModal(false);
  };

  return (
    <>
      <NavDropdown
        title="Tracks"
        id="tracks-dropdown"
        disabled={!handlers.enabled}
      >
        <NavDropdown.Header>Add a Track</NavDropdown.Header>
        <NavDropdown.Item onClick={() => setShowTrackModal(true)}>
          S3 URI...
        </NavDropdown.Item>
      </NavDropdown>
      <ErrorModal
        title="Track Error"
        error={trackError}
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
      />
      <ContainerModal
        show={showTrackModal}
        onHide={() => setShowTrackModal(false)}
      >
        <Form onSubmit={handleSubmit(onTrackSubmit)}>
          <Modal.Header>
            <Modal.Title>Add Track</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormField
              name="name"
              title="Track Name"
              placeholder="Enter track name..."
              description="The display name for the track."
              required={true}
              errors={errors}
              register={register("name")}
            />
            <FormField
              name="trackURI"
              title="Track S3 URI"
              placeholder="Enter track URI..."
              description="S3 URI to the track resource, such as a .bam, .cram or .vcf.gz file."
              required={true}
              errors={errors}
              register={register("trackURI")}
              prefix="s3://"
            />
            <FormField
              name="indexURI"
              title="Index S3 URI"
              placeholder="Enter index URI..."
              description="S3 URI to a file index, such as a .bai, .crai, .tbi or .csi file."
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
            <DarkButton onClick={() => setShowTrackModal(false)}>
              Close
            </DarkButton>
            <DarkButton type="submit">Add Track</DarkButton>
          </Modal.Footer>
        </Form>
      </ContainerModal>
    </>
  );
}
