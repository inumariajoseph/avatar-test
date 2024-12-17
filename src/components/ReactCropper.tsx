import { useState, useRef, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  Button,
  Image,
  useDisclosure,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import UploadModal from "./UploadModal";

interface ReactCropperProps {
  onBack: () => void;
}

interface CropperElement extends HTMLImageElement {
  cropper: Cropper;
}

const ReactCropper = ({ onBack }: ReactCropperProps) => {
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperRef = useRef<CropperElement>(null);
  const [zoom, setZoom] = useState(0);
  const [isCropped, setIsCropped] = useState(false);

  const handleUpload = (file: File, imageData: string) => {
    setUploadedImage(imageData);
    setCroppedImage(null);
    setIsCropped(false);
    onUploadClose();
  };

  const handlePreview = () => {
    if (cropperRef.current?.cropper && isCropped) {
      setCroppedImage(
        cropperRef.current.cropper.getCroppedCanvas().toDataURL()
      );
      onPreviewOpen();
    }
  };

  const handleCancel = useCallback(() => {
    setUploadedImage(null);
    setCroppedImage(null);
    setZoom(0);
    setIsCropped(false);
  }, []);

  const handleSave = () => {
    if (cropperRef.current?.cropper) {
      if (isCropped) {
        const croppedDataUrl = cropperRef.current.cropper
          .getCroppedCanvas()
          .toDataURL();
        console.log("Saving cropped image:", croppedDataUrl);
        setCroppedImage(croppedDataUrl);
      } else {
        console.log("Saving original image:", uploadedImage);
        setCroppedImage(uploadedImage);
      }
    }
  };

  const handleReset = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.reset();
      setZoom(0);
      setIsCropped(false);
    }
  };

  const handleZoomChange = useCallback((value: number) => {
    setZoom(value);
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.zoomTo(value);
      setIsCropped(true);
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + 0.1, 1);
    handleZoomChange(newZoom);
  }, [zoom, handleZoomChange]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - 0.1, 0);
    handleZoomChange(newZoom);
  }, [zoom, handleZoomChange]);

  const handleCropChange = () => {
    setIsCropped(true);
  };

  return (
    <Box minHeight="100vh" padding={4}>
      <VStack
        spacing={3}
        gap="12px"
        align="center"
        justify="center"
        height="100%"
      >
        <Heading as="h2" size="lg">
          React Cropper
        </Heading>

        <Text>Implementation for react-cropper goes here.</Text>
        {uploadedImage ? (
          <Box
            width="100%"
            maxWidth="600px"
            border="1px solid"
            borderColor="gray.200"
            position="relative"
          >
            <Cropper
              src={uploadedImage}
              style={{ height: 400, width: "100%" }}
              initialAspectRatio={16 / 9}
              guides={false}
              ref={cropperRef}
              zoomable={true}
              zoomOnTouch={false}
              zoomOnWheel={false}
              crop={handleCropChange}              
            />
            <HStack mt={4} justifyContent="center">
              <Button
                onClick={handlePreview}
                colorScheme="blue"
                isDisabled={!isCropped}
              >
                Preview
              </Button>
              <Button onClick={handleSave} colorScheme="green">
                Save
              </Button>
              <Button onClick={handleReset} colorScheme="gray">
                Reset
              </Button>
              <Button onClick={handleCancel} colorScheme="red">
                Cancel
              </Button>
            </HStack>
            <HStack mt={4} justifyContent="center" width="100%">
              <Button onClick={handleZoomOut} size="sm" mr={2}>
                -
              </Button>
              <Slider
                aria-label="Zoom slider"
                value={zoom}
                min={0}
                max={1}
                step={0.01}
                onChange={handleZoomChange}
                width="200px"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Button onClick={handleZoomIn} size="sm" ml={2}>
                +
              </Button>
            </HStack>
          </Box>
        ) : (
          <Button onClick={onUploadOpen} colorScheme="teal">
            Upload Image
          </Button>
        )}
      </VStack>
      <Box position="absolute" bottom={4} left={4}>
        <Link onClick={onBack} color="blue.500" fontWeight="medium">
          Back to List
        </Link>
      </Box>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={onUploadClose}
        onUpload={handleUpload}
      />

      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {croppedImage && (
              <Image src={croppedImage} alt="Cropped image preview" />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReactCropper;
