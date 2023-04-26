import React from "react";
import {
  Box,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { CommentType } from "./types";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentType[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const bgColor = useColorModeValue("white", "gray.700");

  return (
    <Box width="100%">
      <VStack spacing={4} align="stretch" width="100%">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} bgColor={bgColor} />
        ))}
      </VStack>
    </Box>
  );
};

export default CommentList;
