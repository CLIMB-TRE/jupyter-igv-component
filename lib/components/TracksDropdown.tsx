import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ContainerModal } from "./base/Modals";
import NavDropdown from "react-bootstrap/NavDropdown";
import { RequiredBadge, OptionalBadge } from "./base/Badges";
import { DarkButton } from "./base/Buttons";
import { CreateOpt, TrackLoad, TrackType } from "igv";
import { useIGVBrowser } from "../context/IGVBrowser";
import { useIGVOptions } from "../context/IGVOptions";
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

function Track() {
  const igvBrowser = useIGVBrowser();
  const setIGVOptions = useIGVOptions();
  const handlers = useHandlers();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [error, setError] = useState<Error | null>(null);
  const [showError, setShowError] = useState(false);
  const handleError = (e: Error) => {
    setError(e);
    setShowError(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TrackSchema),
  });

  const onSubmit: SubmitHandler<TrackForm> = async (data) => {
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
          .then(() => setIGVOptions(browser.toJSON() as unknown as CreateOpt))
          .catch(handleError);
      })
      .catch(handleError);
    handleClose();
  };

  return (
    <>
      <NavDropdown.Item onClick={handleShow}>S3 URI...</NavDropdown.Item>
      <ErrorModal
        title="Track Error"
        error={error}
        show={showError}
        onHide={() => setShowError(false)}
      />
      <ContainerModal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <Modal.Title>Add Track</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                Track Name <RequiredBadge />
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter track name..."
                isInvalid={!!errors.name}
                {...register("name")}
              />
              <Form.Text className="text-muted">
                The display name for the track.
              </Form.Text>
              <div className="small text-danger">{errors.name?.message}</div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Track S3 URI <RequiredBadge />
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter track URI..."
                isInvalid={!!errors.trackURI}
                {...register("trackURI")}
              />
              <Form.Text className="text-muted">
                S3 URI to the track resource, such as a file or webservice, or a
                data URI.
              </Form.Text>
              <div className="small text-danger">
                {errors.trackURI?.message}
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
                S3 URI to a file index, such as a BAM .bai, tabix .tbi, or
                tribble .idx file.
              </Form.Text>
              <div className="small text-danger">
                {errors.indexURI?.message}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <DarkButton onClick={handleClose}>Close</DarkButton>
            <DarkButton type="submit">Add Track</DarkButton>
          </Modal.Footer>
        </Form>
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
