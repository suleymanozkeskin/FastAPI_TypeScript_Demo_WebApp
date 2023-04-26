// src/pages/forum/Entry.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Link,
  VStack,
  IconButton,
  HStack,
  useDisclosure,
  Container,
  ChakraProvider,
} from "@chakra-ui/react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { likeEntry, dislikeEntry } from "../services/entriesApi";
import { EntryType } from "./types";
import CommentForm from "./CommentForm";
import theme from "./theme";

interface EntryProps {
  entry: EntryType & { owner: NonNullable<EntryType["owner"]> };
}

const Entry: React.FC<EntryProps> = ({ entry }) => {
  const router = useRouter();
  const [likes, setLikes] = useState(entry.likes);
  const [dislikes, setDislikes] = useState(entry.dislikes);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showMore, setShowMore] = useState(false);
  const [contentPreview, setContentPreview] = useState("");
  const maxPreviewLength = 1200; // Set the maximum content preview length here

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const entryDate = new Date(entry.created_at).toLocaleDateString(
    "en-US",
    dateOptions
  );

  const handleTitleClick = () => {
    router.push(`/forum/entries/${entry.id}`);
  };

  const handleUsernameClick = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push({
      pathname: "/forum/entries/username/[username]",
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
      console.error("Error liking entry:", error);
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
      console.error("Error disliking entry:", error);
    }
  };

  useEffect(() => {
    if (entry.content.length > maxPreviewLength) {
      setContentPreview(`${entry.content.slice(0, maxPreviewLength)}...`);
    } else {
      setContentPreview(entry.content);
    }
  }, [entry.content]);

  return (
    <Container maxWidth={{ base: "100%", md: "container.xl" }} px={{ base: 4, md: 8 }} py={{ base: 2, md: 4 }} centerContent>
      <Box
        position="relative"
        display="block"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={{ base: 2, md: 4 }}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="md"
        width={{ base: "100%", md: "100%" }}
        mb={4}
        mx={{ base: 2, md: 0 }} // Add this line to add margin on left and right for mobile devices
      >
        <VStack alignItems="start" spacing={{ base: 2, md: 4 }}>
          <Link onClick={handleTitleClick}>
            <Text
              fontWeight="bold"
              fontSize={{
                base: "calc(8px + 2vw)", // 8px is the minimum font size, 2vw means 2% of the viewport width
                sm: "calc(10px + 2vw)", // Adjust the values accordingly
                md: "xl",
              }}              
              color={useColorModeValue("blue.700", "blue.200")}
            >
            {entry.title}
          </Text>
        </Link>
        <Box
          fontSize={{ base: "sm", md: "md" }}
          color={useColorModeValue("gray.700", "gray.200")}
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {showMore ? entry.content : contentPreview}
        </Box>
        {entry.content.length > maxPreviewLength && (
          <Button
            size="sm"
            colorScheme="blue"
            mt={2}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "See Less" : "See More"}
          </Button>
        )}
        <HStack justifyContent="space-between" width="100%" mt={2}>
          <HStack spacing={1}>
            <IconButton
              aria-label="Like entry"
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
            <CommentForm entryId={entry.id} onSuccess={onClose} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
    </Container>
  );
};

export default Entry;
  