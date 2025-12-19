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
import ErrorModal from "./ErrorModal";

type TrackForm = {
  name: string;
  trackURI: string;
  indexURI?: string;
};

const TrackSchema = z.object({
  name: z.string().min(5),
  trackURI: s3URI,
  indexURI: z.union([s3URI, z.literal("")]).optional(),
});

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
      handlers.s3PresignHandler(data.trackURI),
      data.indexURI
        ? handlers.s3PresignHandler(data.indexURI)
        : Promise.resolve(undefined),
    ])
      .then(([presignedTrackURL, presignedIndexURL]) => {
        const browser = igvBrowser.getBrowser();
        browser
          ?.loadTrack({
            name: data.name,
            url: presignedTrackURL,
            indexURL: presignedIndexURL,
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
              description="S3 URI to the track resource, such as a file or webservice, or a data URI."
              required={true}
              errors={errors}
              register={register("trackURI")}
            />
            <FormField
              name="indexURI"
              title="Index S3 URI"
              placeholder="Enter index URI..."
              description="S3 URI to a file index, such as a BAM .bai, tabix .tbi, or tribble .idx file."
              required={false}
              errors={errors}
              register={register("indexURI")}
            />
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
