import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Dropzone from "./Dropzone";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, imageData: string) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  // Clear selected image and file when modal is closed
  useEffect(() => {
    if (!isOpen) {
      // Any cleanup if needed
    }
  }, [isOpen]);

  const handleImageAccepted = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onUpload(file, imageData);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Dropzone onImageAccepted={handleImageAccepted} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadModal;