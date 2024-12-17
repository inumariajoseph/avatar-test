import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  VStack,
  Flex,
  useDisclosure,
  Heading,
  Link,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
} from "@chakra-ui/react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
  useControls,
  useTransformComponent,
} from "react-zoom-pan-pinch";
import UploadModal from "./UploadModal";

interface ReactZoomPanPinchProps {
  onBack: () => void;
}

const ReactZoomPanPinch = ({ onBack }: ReactZoomPanPinchProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();

  const handleUpload = (file: File, imageData: string) => {
    setSelectedImage(imageData);
    onClose();
  };

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <Flex
        justifyContent="center"
        width="100%"
        position="absolute"
        bottom="0"
        padding="2"
      >
        <Button onClick={() => zoomIn()} mr={2}>
          +
        </Button>
        <Button onClick={() => zoomOut()} mr={2}>
          -
        </Button>
        <Button onClick={() => resetTransform()}>Reset</Button>
      </Flex>
    );
  };

  const [transformState, setTransformState] = useState({
    scale: 1,
    positionX: 0,
    positionY: 0,
  });

  const handleTransform = (e: any) => {
    setTransformState({
      scale: e.state.scale,
      positionX: e.state.positionX,
      positionY: e.state.positionY,
    });
  };
  const handlePreview = () => {
    if (selectedImage) {
      const { scale, positionX, positionY } = transformState;

      // Create a canvas to draw the preview
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size to the visible area
      canvas.width = 600; // match the width of your TransformWrapper
      canvas.height = 400; // match the height of your TransformWrapper

      // Create an image object
      const img = document.createElement("img");
      img.onload = () => {
        // Calculate the visible area
        const visibleWidth = canvas.width / scale;
        const visibleHeight = canvas.height / scale;
        const sourceX = -positionX / scale + (img.width - visibleWidth) / 2;
        const sourceY = -positionY / scale + (img.height - visibleHeight) / 2;

        // Draw the visible part of the image on the canvas
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          visibleWidth,
          visibleHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Convert canvas to data URL and set as preview image
        const previewDataUrl = canvas.toDataURL("image/png");
        setPreviewImage(previewDataUrl);
        onPreviewOpen(); // Open the preview modal
      };
      img.src = selectedImage;
    }
  };

  const handleSubmit = async () => {
    if (selectedImage) {
      try {
        const imageData = await prepareImageData();
        // Here, you would typically send imageData to your API
        console.log('Image data prepared for API:', imageData);
        // Add your API call here, for example:
        // await sendImageToAPI(imageData);
      } catch (error) {
        console.error('Error preparing image data:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };
  
  const prepareImageData = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const { scale, positionX, positionY } = transformState;
      const isZoomed = scale !== 1 || positionX !== 0 || positionY !== 0;
  
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Unable to create canvas context'));
        return;
      }
  
      const img = document.createElement("img");
      img.onload = () => {
        if (isZoomed) {
          // Set canvas size to the visible area
          canvas.width = 600; // match the width of your TransformWrapper
          canvas.height = 400; // match the height of your TransformWrapper
  
          // Calculate the visible area
          const visibleWidth = canvas.width / scale;
          const visibleHeight = canvas.height / scale;
          const sourceX = (-positionX / scale) + (img.width - visibleWidth) / 2;
          const sourceY = (-positionY / scale) + (img.height - visibleHeight) / 2;
  
          // Draw the visible part of the image on the canvas
          ctx.drawImage(
            img,
            sourceX, sourceY, visibleWidth, visibleHeight,
            0, 0, canvas.width, canvas.height
          );
        } else {
          // If not zoomed, use the full image
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
  
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        resolve(imageDataUrl);
      };
  
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
  
      img.src = selectedImage || '';
    });
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
          React Zoom Pan Pinch
        </Heading>

        {selectedImage ? (
          <Box
            width="100%"
            maxWidth="600px"
            height="400px"
            border="1px solid"
            borderColor="gray.200"
            position="relative"
          >
            <TransformWrapper onTransformed={(e) => handleTransform(e)}>
              <TransformComponent>
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </TransformComponent>
              <Controls />
            </TransformWrapper>
            {previewImage && (
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                backgroundColor="rgba(0, 0, 0, 0.5)"
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Button onClick={onOpen} colorScheme="teal">
            Upload Image
          </Button>
        )}

        <Flex>
          <Button
            onClick={handleSubmit}
            colorScheme="teal"
            loadingText="Saving..."
            isDisabled={!selectedImage}
            mr={2}
          >
            Save changes
          </Button>
          <Button
            onClick={ handlePreview}
            colorScheme={"blue"}
            isDisabled={!selectedImage}
          >
            Preview
          </Button>
        </Flex>
      </VStack>

      <Flex position="absolute" bottom={4} left={4}>
        <Link onClick={onBack} color="blue.500" fontWeight="medium">
          Back to List
        </Link>
      </Flex>

      <UploadModal isOpen={isOpen} onClose={onClose} onUpload={handleUpload} />

      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {previewImage && <Image src={previewImage} alt="Preview" />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReactZoomPanPinch;
