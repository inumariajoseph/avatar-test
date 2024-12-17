import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import ReactAvatarEditor from "./components/ReactAvatarEditor";
import ReactCropper from "./components/ReactCropper";
import ReactMediumImageZoom from "./components/ReactMediumImageZoom";
import ReactZoomPanPinch from "./components/ReactZoomPanPinch";

interface AvatarTestProps {
  onClose: () => void;
}

const AvatarTest = ({ onClose }: AvatarTestProps): JSX.Element => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  const handleComponentSelect = (component: string) => {
    setSelectedComponent(component);
  };

  const handleBackToList = () => {
    setSelectedComponent(null);
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "react-zoom-pan-pinch":
        return <ReactZoomPanPinch onBack={handleBackToList} />;
      case "react-medium-image-zoom":
        return <ReactMediumImageZoom onBack={handleBackToList} />;
      case "react-avatar-editor":
        return <ReactAvatarEditor onBack={handleBackToList} />;
      case "react-cropper":
        return <ReactCropper onBack={handleBackToList} />;
      default:
        return null;
    }
  };

  return (
    <Box position="relative" width="100%" height="100vh">
      <Flex
        width="100%"
        height="100%"
        flexDirection="column"
        alignItems="center"
      >
        {selectedComponent ? (
          renderSelectedComponent()
        ) : (
          <VStack spacing={6} align="center" padding={8} maxWidth="600px">
            <Heading as="h2" size="lg" textAlign="center">
              Avatar Test Component
            </Heading>
            <Text fontSize="md" textAlign="center">
              Select a library to test:
            </Text>
            <UnorderedList spacing={2}>
              {[
                "react-zoom-pan-pinch",
                "react-medium-image-zoom",
                "react-avatar-editor",
                "react-cropper",
              ].map((name) => (
                <ListItem
                  key={name}
                  cursor="pointer"
                  onClick={() => handleComponentSelect(name)}
                  _hover={{ color: "blue.500" }}
                >
                  {name}
                </ListItem>
              ))}
            </UnorderedList>
          </VStack>
        )}
      </Flex>
      {!selectedComponent && (
        <Flex position="absolute" bottom={4} left={4}>
          <Button colorScheme="blue" onClick={onClose}>
            Back
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default AvatarTest;
