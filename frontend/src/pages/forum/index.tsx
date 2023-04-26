// src/pages/forum/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  VStack,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getAllEntries, getEntriesByTag, getPaginatedEntries } from "../../services/entriesApi";
import Entry from "../../components/Entry";
import { EntryType } from "../../components/types";
import { useToast } from "@chakra-ui/react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import CreateEntryForm from "@/components/CreateEntryForm";
import Tagbar from "@/components/Tagbar";
import ForumSidebar from "@/components/ForumSidebar";

const Forum: React.FC = () => {
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);


  const fetchEntries = useCallback(
    async (page: number) => {
      const entries = await getPaginatedEntries(page);
      setEntries(entries);

      if (entries.length < 10) {
        setHasMore(false);
        if (page > 1) {
          toast({
            title: "End of entries",
            description: "You have reached the end of entries.",
            status: "info",
            duration: 3000,
            isClosable: true,
            position: "bottom",
          });
        }
      } else {
        setHasMore(true);
      }
    },
    [toast]
  );

  const fetchEntriesByTag = useCallback(
    async (tag: string, skip: number) => {
      setPage(1);
      const entries = await getEntriesByTag(tag, skip);
      setEntries(entries);
      setIsEmpty(entries.length === 0);
    },
    []
  );
  
  
  


  useEffect(() => {
    if (!selectedTag) {
      fetchEntries(page);
    }
  }, [page, fetchEntries, selectedTag]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    fetchEntriesByTag(tag, 0);
  };
  

  const handleNext = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const handleBack = () => {
    setPage(Math.max(page - 1, 1));
  };

  const handleCreateEntrySuccess = () => {
    setPage(1);
  
    if (selectedTag) {
      fetchEntriesByTag(selectedTag, 0);
    } else {
      fetchEntries(1);
    }
  
    toast({
      title: "Entry created",
      description: "Your entry has been successfully created.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  };
  
  const handleBackToForum = () => {
    setSelectedTag(null);
    setIsEmpty(false);
  };
  
  
  

  return (
    <BackgroundWrapper>
      <Tagbar onSelectTag={handleTagClick} />
      <ForumSidebar>
        <VStack spacing={4} p={6} w="80%" m="auto">
          <Button colorScheme="teal" mb={4} onClick={onOpen}>
            Create Entry
          </Button>
          {isEmpty && (
            <>
              <Box>
                There is no entry for this tag. Care to create one?
              </Box>
              <Button colorScheme="teal" onClick={handleBackToForum}>
                Back to Forum
              </Button>
            </>
          )}
          {entries.map((entry) => (
            <Entry key={entry.id} entry={entry} />
          ))}
          <HStack>
            <Button onClick={handleBack} disabled={page === 1}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!hasMore}>
              Next
            </Button>
          </HStack>
        </VStack>
      </ForumSidebar>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateEntryForm onSuccess={handleCreateEntrySuccess} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </BackgroundWrapper>
  );
};
export default Forum;