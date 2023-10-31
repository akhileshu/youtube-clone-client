import { Box, Text } from "@chakra-ui/react";

const NoVideosMessage = () => {
  return (
    <Box
      p={4}
      m={5}
      borderWidth="1px"
      borderRadius="md"
      textAlign="center"
      bg="gray.200"
    >
      <Text>No videos found. Check back later or add some videos.</Text>
    </Box>
  );
};

export default NoVideosMessage;
