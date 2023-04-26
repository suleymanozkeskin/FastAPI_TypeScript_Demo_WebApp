// src/components/CommentItem.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  IconButton,
  Button,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { CommentType } from "./types";
import { likeComment, dislikeComment } from "../services/entriesApi";


interface CommentItemProps {
  comment: CommentType;
  bgColor: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, bgColor }) => {
  const color = useColorModeValue("gray.700", "gray.200");
  const ownerColor = useColorModeValue("gray.700", "gray.200");
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);


  const commentDate = new Date(comment.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const maxPreviewLength = 1200;
  const [showMore, setShowMore] = useState(false);
  const [contentPreview, setContentPreview] = useState("");
  
  const handleLikeClick = async () => {
    try {
      await likeComment(comment.id);
      setUserLiked(!userLiked);
      if (userDisliked) {
        setUserDisliked(false);
        setDislikes(dislikes - 1);
      }
      setLikes(userLiked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislikeClick = async () => {
    try {
      await dislikeComment(comment.id);
      setUserDisliked(!userDisliked);
      if (userLiked) {
        setUserLiked(false);
        setLikes(likes - 1);
      }
      setDislikes(userDisliked ? dislikes - 1 : dislikes + 1);
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };


  useEffect(() => {
    if (comment.content.length > maxPreviewLength) {
      setContentPreview(`${comment.content.slice(0, maxPreviewLength)}...`);
    } else {
      setContentPreview(comment.content);
    }
  }, [comment.content]);

  

  return (
    <Box
      id={`comment-${comment.id}`}
      bg={bgColor}
      p={4}
      borderRadius="lg"
      boxShadow="md"
      width="100%"
    >
      <Text fontSize="md" color={color} whiteSpace="pre-wrap" lineHeight={1.6}>
        {showMore ? comment.content : contentPreview}
      </Text>
      {comment.content.length > maxPreviewLength && (
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
            aria-label="Like comment"
            icon={<FiArrowUp />}
            size="sm"
            variant="outline"
            onClick={handleLikeClick}
          />
          <Text fontSize="sm" color={color}>
            {comment.likes}
          </Text>
          <IconButton
            aria-label="Dislike comment"
            icon={<FiArrowDown />}
            size="sm"
            variant="outline"
            onClick={handleDislikeClick}
          />
          <Text fontSize="sm" color={color}>
            {comment.dislikes}
          </Text>
        </HStack>
        <VStack alignItems="flex-end" spacing={0}>
          <Text fontSize="sm" color={ownerColor}>
            {comment.owner?.username || "Unknown"}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {commentDate}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default CommentItem;
