import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import React from "react";

function LogoutAlert({ handleLogout, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = React.useRef();

  return (
    <>
      {/* children -> what we want to show that triggers the alert box generally text/icon */}

      <Text mb={0} w={"100%"} onClick={onOpen}>
        {children}
      </Text>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Logout Session</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to Logout your Account
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              onClick={() => {
                handleLogout();
                onClose();
              }}
              colorScheme="red"
              ml={3}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default LogoutAlert;
