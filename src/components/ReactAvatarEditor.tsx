import { useState, useRef} from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  Link,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,

} from "@chakra-ui/react";
import AvatarEditor from "react-avatar-editor";
import UploadModal from "./UploadModal";

interface ReactAvatarEditorProps {
  onBack: () => void;
}

const ReactAvatarEditor = ({ onBack }: ReactAvatarEditorProps) => {
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
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const editorRef = useRef<AvatarEditor>(null);

  const CIRCLE_DIAMETER = 150;

  const calculateCircleArea = (diameter: number) => {
    const radius = diameter / 2;
    return Math.PI * radius * radius;
  };

  const handleUpload = (file: File, imageData: string) => {
    setUploadedImage(imageData);
    setCroppedImage(null);
    setScale(1);
    setPosition({ x: 0.5, y: 0.5 });
    onUploadClose();
  };

  const handlePreview = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const croppedImageData = canvas.toDataURL();
      setCroppedImage(croppedImageData);
      onPreviewOpen();
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const croppedImageData = canvas.toDataURL();
      setCroppedImage(croppedImageData);
      
      const circleArea = calculateCircleArea(CIRCLE_DIAMETER);
      const circleData = {
        diameter: CIRCLE_DIAMETER,
        area: circleArea.toFixed(2),
        imageData: croppedImageData,
      };
      
      console.log("Circle data:", circleData);
  
    }
  };

  const handleZoom = (increment: number) => {
    setScale((prevScale) => Math.max(1, Math.min(prevScale + increment, 3)));
  };

  const handleSliderChange = (value: number) => {
    setScale(value);
  };

  const handlePositionChange = (position: { x: number; y: number }) => {
    setPosition(position);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0.5, y: 0.5 });
  };

  const handleCancel = () => {
    setUploadedImage(null);
    setCroppedImage(null);
    setScale(1);
    setPosition({ x: 0.5, y: 0.5 });
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
          React Avatar Editor
        </Heading>
        {uploadedImage ? (
          <>
            <Box position="relative" width="300px" height="300px">
              <AvatarEditor
                ref={editorRef}
                image={uploadedImage}
                width={300}
                height={300}
                border={0}
                color={[255, 255, 255, 0.6]}
                scale={scale}
                rotate={0}
                position={position}
                onPositionChange={handlePositionChange}
              />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                width={`${CIRCLE_DIAMETER}px`}
                height={`${CIRCLE_DIAMETER}px`}
                borderRadius="50%"
                border="2px solid white"
                boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.5)"
                pointerEvents="none"
              />
            </Box>
            <HStack spacing={2} width="100%" maxWidth="300px">
              <Button onClick={() => handleZoom(-0.1)} size="sm">
                -
              </Button>
              <Slider
                aria-label="zoom-slider"
                min={1}
                max={3}
                step={0.01}
                value={scale}
                onChange={handleSliderChange}
                flex={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Button onClick={() => handleZoom(0.1)} size="sm">
                +
              </Button>
            </HStack>

            <HStack spacing={4}>
              <Button onClick={handleReset} size="sm" colorScheme="gray">
                Reset
              </Button>
              <Button onClick={handlePreview} colorScheme="blue">
                Preview
              </Button>
              <Button onClick={handleSave} colorScheme="green">
                Save
              </Button>
              <Button onClick={handleCancel} colorScheme="red">
                Cancel
              </Button>
            </HStack>
          </>
        ) : (
          <Button onClick={onUploadOpen} colorScheme="blue">
            Upload Image
          </Button>
        )}
        <UploadModal
          isOpen={isUploadOpen}
          onClose={onUploadClose}
          onUpload={handleUpload}
        />
        <Modal isOpen={isPreviewOpen} onClose={onPreviewClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              {croppedImage && (
                <VStack spacing={4}>
                  <Image
                    src={croppedImage}
                    alt="Cropped preview"
                    borderRadius="50%"
                    width={`${CIRCLE_DIAMETER}px`}
                    height={`${CIRCLE_DIAMETER}px`}
                  />
                  <Text>
                    Circular image size: {CIRCLE_DIAMETER}x{CIRCLE_DIAMETER} pixels
                    <br />
                    Circle area: {calculateCircleArea(CIRCLE_DIAMETER).toFixed(2)} square pixels
                  </Text>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
      <Box position="absolute" bottom={4} left={4}>
        <Link onClick={onBack} color="blue.500" fontWeight="medium">
          Back to List
        </Link>
      </Box>
    </Box>
  );
};

export default ReactAvatarEditor;