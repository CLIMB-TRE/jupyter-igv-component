import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useIGV } from "../context/IGVContext";
import { ContainerModal } from "./base/Modals";
import NavDropdown from "react-bootstrap/NavDropdown";
import { RequiredBadge, OptionalBadge } from "./base/Badges";
import { DarkButton } from "./base/Buttons";
import { TrackLoad, TrackType } from "igv";
import { useHandlers } from "../context/HandlersContext";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { s3URI } from "../utils/validators";

type TrackForm = {
  name: string;
  trackURI: string;
  indexURI?: string;
};

const TrackSchema = z.object({
  name: z.string().min(1),
  trackURI: s3URI,
  indexURI: z.union([s3URI, z.literal("")]).optional(),
});

function Track() {
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
    resolver: zodResolver(TrackSchema),
  });

  const onSubmit: SubmitHandler<TrackForm> = async (data) => {
    const [presignedTrackURL, presignedIndexURL] = await Promise.all([
      handlers.s3PresignHandler(data.trackURI),
      data.indexURI
        ? handlers.s3PresignHandler(data.indexURI)
        : Promise.resolve(undefined),
    ]);
    igvContext.getBrowser()?.loadTrack({
      name: data.name,
      url: presignedTrackURL,
      indexURL: presignedIndexURL,
    } as TrackLoad<TrackType>);
    handleClose();
  };

  return (
    <>
      <NavDropdown.Item onClick={handleShow}>S3 URI...</NavDropdown.Item>
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
