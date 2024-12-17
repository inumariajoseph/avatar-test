import React, { useState, useMemo, useCallback } from "react";
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

const COMPONENTS = {
  "react-zoom-pan-pinch": ReactZoomPanPinch,
  "react-medium-image-zoom": ReactMediumImageZoom,
  "react-avatar-editor": ReactAvatarEditor,
  "react-cropper": ReactCropper,
} as const;

type ComponentName = keyof typeof COMPONENTS;

const AvatarTest = ({ onClose }: AvatarTestProps) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentName | null>(null);

  const handleComponentSelect = useCallback((component: ComponentName) => {
    setSelectedComponent(component);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedComponent(null);
  }, []);

  const SelectedComponent = useMemo(() => {
    return selectedComponent ? COMPONENTS[selectedComponent] : null;
  }, [selectedComponent]);

  const componentList = useMemo(() => Object.keys(COMPONENTS) as ComponentName[], []);

  return (
    <Box position="relative" width="100%" height="100vh">
      <Flex width="100%" height="100%" flexDirection="column" alignItems="center">
        {SelectedComponent ? (
          <SelectedComponent onBack={handleBackToList} />
        ) : (
          <VStack spacing={6} align="center" padding={8} maxWidth="600px">
            <Heading as="h2" size="lg" textAlign="center">
              Avatar Test Component
            </Heading>
            <Text fontSize="md" textAlign="center">
              Select a library to test:
            </Text>
            <UnorderedList spacing={2}>
              {componentList.map((name) => (
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