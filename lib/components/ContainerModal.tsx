import React from "react";
import { Modal, ModalProps } from "react-bootstrap";

interface ContainerModalProps extends Omit<ModalProps, "container"> {
  children: React.ReactNode;
}

/**
 * Base modal component that automatically scopes modals to the app's container
 * to ensure Bootstrap styles are properly applied when scoped.
 */
export function ContainerModal({ children, ...props }: ContainerModalProps) {
  const container = document.getElementById("jupyter-igv-app");

  return (
    <Modal {...props} container={container} centered>
      {children}
    </Modal>
  );
}

export default ContainerModal;
