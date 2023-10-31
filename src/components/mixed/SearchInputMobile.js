import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

function SearchInputMobile({ hadlevideosSearch, searchTerm, setSearchTerm }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  return (
    <>
      <SearchIcon onClick={onOpen} />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent width={"95%"}>
            <AlertDialogBody>
              {/*  */}
              <form
                onSubmit={(e) => {
                  onClose();
                  hadlevideosSearch(e);
                }}
              >
                <InputGroup size="md">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    pr="4.5rem"
                    type="text"
                    placeholder="Search Videos"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      isDisabled={!searchTerm}
                      type="submit"
                      h="1.75rem"
                      size="sm"
                    >
                      go
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </form>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default SearchInputMobile;
