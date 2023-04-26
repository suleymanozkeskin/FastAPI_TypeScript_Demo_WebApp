// src/pages/forum/entries/[entryId].tsx
// src/pages/forum/entries/[entryId].tsx
import React, { useEffect, useState, useRef } from 'react';
import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import EntryDetails from '../../../components/EntryDetails';
import { getEntryWithComments } from '../../../services/entriesApi';
import { EntryType, CommentType } from '../../../components/types';
import Comments from '../../../components/CommentList';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import Tagbar from '@/components/Tagbar';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter } from '@chakra-ui/react';
import CommentForm from '../../../components/CommentForm';
import { useDisclosure } from "@chakra-ui/react";

const EntryDetailsPage: React.FC = () => {
  const [entry, setEntry] = useState<EntryType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const commentsRef = useRef<CommentType[]>([]); // Add a ref for the comments state
  const router = useRouter();
  const { entryId } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchEntryAndComments = async () => {
      if (entryId) {
        try {
          const entryWithComments = await getEntryWithComments(Number(entryId));
          console.log('Entry:', entryWithComments.entry);
          console.log('Comments:', entryWithComments.comments);
          setEntry(entryWithComments.entry);
          setComments(entryWithComments.comments);
          commentsRef.current = entryWithComments.comments; // Update the ref instead of the state
          console.log('Comments in EntryDetailsPage:', entryWithComments.comments);
          console.log("Updated comments state in EntryDetailsPage:", commentsRef.current);

        } catch (error) {
          console.error('Error fetching entry and comments:', error);
        }
      }
    };

    fetchEntryAndComments();
  }, [entryId]);

  const handleTagSelection = (tag: string) => {
    console.log("Selected tag:", tag);
    // Navigate to the tag page
    router.push({
      pathname: "/forum/tags/[tag]",
      query: { tag },
    });
  };

  const bgColor = useColorModeValue("gray.50", "gray.700");

  

  return (
    <BackgroundWrapper>
      <Tagbar onSelectTag={handleTagSelection} />
      <Box pt={4} pl={4} pr={4} pb={20} maxWidth="1200px" mx="auto">
        <VStack spacing={4} align="stretch" maxWidth="800px" mx="auto" pt={8} pb={16}>
          {entry && <EntryDetails entry={entry} />}
          <Comments comments={comments} />
        </VStack>
      </Box>
    </BackgroundWrapper>
  );
};

export default EntryDetailsPage;
