// src/components/EntryDetails.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  IconButton,
  Link,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { EntryType } from './types';
import { likeEntry, dislikeEntry } from '../services/entriesApi';
import { useDisclosure } from "@chakra-ui/react";
import CommentForm from "./CommentForm";


interface EntryDetailsProps {
  entry: EntryType & { owner: NonNullable<EntryType['owner']> };
}

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry }) => {
  const router = useRouter();
  const [likes, setLikes] = useState(entry.likes);
  const [dislikes, setDislikes] = useState(entry.dislikes);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const entryDate = new Date(entry.created_at).toLocaleDateString(
    'en-US',
    dateOptions
  );

  const handleTitleClick = () => {
    router.push(`/forum/entries/${entry.id}`);
  };

  const handleUsernameClick = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push({
      pathname: '/forum/entries/username/[username]',
      query: { username: entry.owner.username },
    });
  };

  const handleLikeClick = async () => {
    try {
      await likeEntry(entry.id);
      setUserLiked(!userLiked);
      if (userDisliked) {
        setUserDisliked(false);
        setDislikes(dislikes - 1);
      }
      setLikes(userLiked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error('Error liking entry:', error);
    }
  };

  const handleDislikeClick = async () => {
    try {
      await dislikeEntry(entry.id);
      setUserDisliked(!userDisliked);
      if (userLiked) {
        setUserLiked(false);
        setLikes(likes - 1);
      }
      setDislikes(userDisliked ? dislikes - 1 : dislikes + 1);
    } catch (error) {
      console.error('Error disliking entry:', error);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow="md"
      width="100%"
      mb={4}
    >
      <VStack alignItems="start" spacing={0}>
        <Link onClick={handleTitleClick}>
          <Text
            fontWeight="bold"
            fontSize="xl"
            color={useColorModeValue('blue.700', 'blue.200')}
          >
            {entry.title}
          </Text>
        </Link>
        <Box
          fontSize="md"
          color={useColorModeValue('gray.700', 'gray.200')}
          sx={{ whiteSpace: 'pre-wrap' }}
        >
          {entry.content}
        </Box>
        <HStack justifyContent="space-between" width="100%" mt={2}>
          <HStack spacing={1}>
            <IconButton aria-label="Like entry"
            icon={<FiArrowUp />}
            size="sm"
            onClick={handleLikeClick}
            variant="outline"
            color={useColorModeValue("gray.700", "gray.200")}
          />
          <Text
            fontSize="sm"
            color={useColorModeValue("gray.500", "gray.400")}
          >
            {likes}
          </Text>
          <IconButton
            aria-label="Dislike entry"
            icon={<FiArrowDown />}
            size="sm"
            onClick={handleDislikeClick}
            variant="outline"
            color={useColorModeValue("gray.700", "gray.200")}
          />
          <Text
            fontSize="sm"
            color={useColorModeValue("gray.500", "gray.400")}
          >
            {dislikes}
          </Text>
        </HStack>
        <VStack alignItems="flex-end" spacing={0}>
          <Link
            href={`/forum/entries/username/${entry.owner.username}`}
            onClick={handleUsernameClick}
          >
            <Text
              fontSize="sm"
              color={useColorModeValue("black.500", "gray.100")}
            >
              {entry.owner.username}
            </Text>
          </Link>
          <Text
            fontSize="xs"
            color={useColorModeValue("gray.500", "gray.400")}
          >
            {entryDate}
          </Text>
        </VStack>
      </HStack>
    </VStack>
    <Button colorScheme="teal" mt={4} onClick={onOpen}>
      Reply to this entry
    </Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new comment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CommentForm
            entryId={entry.id}
            onSuccess={() => {
              onClose();
              // Call the onCommentAdded function when a new comment is created.
              // onCommentAdded();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Box>
);
};

export default EntryDetails;