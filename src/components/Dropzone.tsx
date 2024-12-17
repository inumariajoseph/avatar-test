import React, { useCallback, useState } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

interface DropzoneProps {
  onImageAccepted: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onImageAccepted }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return false;
    }
    setError(null);
    return true;
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (validateFile(file)) {
        onImageAccepted(file);
      }
    }
  }, [onImageAccepted]);

  const onFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (validateFile(file)) {
        onImageAccepted(file);
      }
    }
  }, [onImageAccepted]);

  return (
    <Box
      border="2px dashed"
      borderColor={isDragActive ? "blue.500" : "gray.300"}
      borderRadius="md"
      p={6}
      textAlign="center"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ borderColor: "blue.500" }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onFileInputChange}
      />
      <VStack spacing={2}>
        <Text fontSize="3xl">🖼️</Text>
        <Text>
          {isDragActive
            ? "Drop the image here"
            : "Drop your image here or click to upload"}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Supported formats: JPEG, PNG, GIF, WebP
        </Text>
        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default Dropzone;