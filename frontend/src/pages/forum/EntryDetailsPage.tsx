// src/pages/forum/EntryDetailsPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import EntryDetails from '../../components/EntryDetails';
import { getEntryWithComments } from '../../services/entriesApi';
import { EntryType, CommentType } from '../../components/types';
import Comments from '../../components/CommentList';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import CommentForm from '../../components/CommentForm';
import { useDisclosure } from '@chakra-ui/react';

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
          setEntry(entryWithComments.entry);
          setComments(entryWithComments.comments);
          commentsRef.current = entryWithComments.comments; // Update the ref instead of the state
        } catch (error) {
          console.error('Error fetching entry and comments:', error);
        }
      }
    };

    fetchEntryAndComments();
  }, [entryId]);

  const handleReplyButtonClick = () => {
    onOpen();
  };

  const handleCommentSubmit = async () => {
    onClose();
  
    // Refetch the entry and comments
    try {
      const entryWithComments = await getEntryWithComments(Number(entryId));
      setComments(entryWithComments.comments);
      commentsRef.current = entryWithComments.comments;
    } catch (error) {
      console.error('Error fetching entry and comments after submitting comment:', error);
    }
  };
  

  return (
    <BackgroundWrapper>
      <VStack spacing={4} align="stretch" maxWidth="800px" mx="auto" pt={8} pb={16}>
        {entry && <EntryDetails entry={entry} onReplyButtonClick={handleReplyButtonClick} />}
        <Comments comments={comments} />
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reply to entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <CommentForm entryId={Number(entryId)} onClose={handleCommentSubmit} />
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

export default EntryDetailsPage;
