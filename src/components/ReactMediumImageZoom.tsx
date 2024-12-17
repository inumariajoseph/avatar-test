import React, { useRef, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Flex,
  Link,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
} from "@chakra-ui/react";
import UploadModal from "./UploadModal";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ReactMediumImageZoomProps {
  onBack: () => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ReactMediumImageZoom = ({ onBack }: ReactMediumImageZoomProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();

  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const aspect = 16 / 9;
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (file: File, imageData: string) => {
    setCrop(undefined);
    setImgSrc(imageData);
    setScale(1);
    setRotate(0);
    onClose();
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    },
    [aspect]
  );

  const handleZoomChange = (value: number) => {
    setScale(value);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.1));
  };

  const handleRotateChange = (value: number) => {
    setRotate(value);
  };

  const handleReset = () => {
    setScale(1);
    setRotate(0);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

   const generateCroppedImage = useCallback(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Create a temporary canvas to handle the zoomed and rotated image
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) {
        throw new Error("No 2d context");
      }

      // Set the temp canvas size to the full image size
      tempCanvas.width = image.naturalWidth;
      tempCanvas.height = image.naturalHeight;

      // Translate to the center of the image
      tempCtx.translate(image.naturalWidth / 2, image.naturalHeight / 2);
      // Rotate the image
      tempCtx.rotate((rotate * Math.PI) / 180);
      // Scale the image
      tempCtx.scale(scale, scale);
      // Draw the image back to its original position
      tempCtx.drawImage(
        image,
        -image.naturalWidth / 2,
        -image.naturalHeight / 2,
        image.naturalWidth,
        image.naturalHeight
      );

      // Set the main canvas size to the cropped size
      canvas.width = crop.width;
      canvas.height = crop.height;

      // Draw the cropped portion from the temp canvas to the main canvas
      canvas
        .getContext("2d")
        ?.drawImage(
          tempCanvas,
          (crop.x * scaleX) / scale,
          (crop.y * scaleY) / scale,
          (crop.width * scaleX) / scale,
          (crop.height * scaleY) / scale,
          0,
          0,
          crop.width,
          crop.height
        );

      return canvas.toDataURL("image/jpeg");
    }
    return null;
  }, [completedCrop, scale, rotate]);
  const isValidCrop = useCallback(() => {
    return !!(completedCrop && completedCrop.width && completedCrop.height);
  }, [completedCrop]);

  const handlePreviewClick = useCallback(() => {
    if (isValidCrop()) {
      const croppedImage = generateCroppedImage();
      if (croppedImage) {
        setCroppedImageUrl(croppedImage);
        onPreviewOpen();
      }
    }
  }, [isValidCrop, generateCroppedImage, onPreviewOpen]);

  // const handleSave = useCallback(() => {
  //   let apiData;

  //   if (isValidCrop()) {
  //     const croppedImage = generateCroppedImage();
  //     if (croppedImage) {
  //       apiData = {
  //         originalImage: imgSrc,
  //         croppedImage: croppedImage,
  //         cropDetails: completedCrop,
  //         scale: scale,
  //         rotate: rotate,
  //       };
  //     }
  //   }

  //   if (!apiData) {
  //     // If no valid crop or cropped image generation failed, save the original image
  //     apiData = {
  //       originalImage: imgSrc,
  //       croppedImage: imgSrc, // Use the original image
  //       cropDetails: null,
  //       scale: 1,
  //       rotate: 0,
  //     };
  //   }

  //   console.log("Data to send to API:", apiData);

  //   // Here you would typically send the apiData to your backend
  //   // For example:
  //   // sendToBackend(apiData);
  // }, [isValidCrop, generateCroppedImage, imgSrc, completedCrop, scale, rotate]);
 
  const handleSave = useCallback(() => {
    const formData = new FormData();
  
    if (isValidCrop()) {
      const croppedImage = generateCroppedImage();
      if (croppedImage) {
        // Convert the base64 string to a Blob
        const croppedBlob = dataURItoBlob(croppedImage);
        formData.append('croppedImage', croppedBlob, 'cropped.jpg');
      }
    }
  
    // Append the original image
    if (imgSrc) {
      const originalBlob = dataURItoBlob(imgSrc);
      formData.append('originalImage', originalBlob, 'original.jpg');
    }
  
    // Append other data
    formData.append('cropDetails', JSON.stringify(completedCrop));
    formData.append('scale', scale.toString());
    formData.append('rotate', rotate.toString());
  
    const formDataObj = Object.fromEntries(formData);

    console.log("FormData prepared for API:", formDataObj);
  
    // Here you would typically send the formData to your backend
    // For example:
    // sendToBackend(formData);
  }, [isValidCrop, generateCroppedImage, imgSrc, completedCrop, scale, rotate]);
  
  // Helper function to convert base64/DataURL to Blob
  function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
  }
 
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
          React Medium Image Zoom
        </Heading>
        <Text>Implementation for react-medium-image-zoom goes here.</Text>
        {imgSrc ? (
          <>
            <Box
              width="100%"
              maxWidth="600px"
              border="1px solid"
              borderColor="gray.200"
              position="relative"
            >
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </Box>
            <Flex width="100%" maxWidth="600px" direction="column" gap={2}>
              <Flex alignItems="center">
                <Text mr={2}>Zoom</Text>
                <Button onClick={handleZoomOut} size="sm" mr={2}>
                  -
                </Button>
                <Slider
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={scale}
                  onChange={handleZoomChange}
                  flex={1}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Button onClick={handleZoomIn} size="sm" ml={2}>
                  +
                </Button>
              </Flex>
              <Text>Rotate</Text>
              <Slider
                min={0}
                max={360}
                step={1}
                value={rotate}
                onChange={handleRotateChange}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>
            <Flex>
              <Button onClick={handleReset} colorScheme="gray" mr={2}>
                Reset
              </Button>
              <Button
                onClick={handlePreviewClick}
                colorScheme="blue"
                mr={2}
                isDisabled={!isValidCrop()}
              >
                Preview Crop
              </Button>
              <Button onClick={handleSave} colorScheme="green">
                Save Crop
              </Button>
            </Flex>
          </>
        ) : (
          <Button onClick={onOpen} colorScheme="teal">
            Upload Image
          </Button>
        )}
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
          <ModalHeader>Cropped Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {croppedImageUrl && (
              <Image src={croppedImageUrl} alt="Cropped preview" />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <canvas
        ref={previewCanvasRef}
        style={{
          display: "none",
          border: "1px solid black",
          objectFit: "contain",
          width: completedCrop?.width ?? 0,
          height: completedCrop?.height ?? 0,
        }}
      />
    </Box>
  );
};

export default ReactMediumImageZoom;
