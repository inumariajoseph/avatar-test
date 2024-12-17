import React, { useState } from "react";
import { Box, Button, Flex, Heading, VStack } from "@chakra-ui/react";
import AvatarTest from "./AvatarTest";

function App() {
  const [showAvatarTest, setShowAvatarTest] = useState(false);

  const handleAvatarTestClick = () => {
    setShowAvatarTest(true);
  };

  const handleCloseAvatarTest = () => {
    setShowAvatarTest(false);
  };

  return (
    <Flex
      minHeight="100vh"
      width="100%"
      backgroundColor="gray.100"
      alignItems="center"
      justifyContent="center"
    >
      <Box width="100%" height="100vh">
        {!showAvatarTest ? (
          <VStack spacing={8} height="100%" justifyContent="center">
            <Heading as="h1" size="xl">
              Welcome to Avatar Test
            </Heading>
            <Button colorScheme="blue" onClick={handleAvatarTestClick}>
              Start Avatar Test
            </Button>
          </VStack>
        ) : (
          <AvatarTest onClose={handleCloseAvatarTest} />
        )}
      </Box>
    </Flex>
  );
}

export default App;