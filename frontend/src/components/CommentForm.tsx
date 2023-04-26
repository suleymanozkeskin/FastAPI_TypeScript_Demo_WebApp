// src/components/CommentForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, FormControl, FormLabel, Textarea } from "@chakra-ui/react";
import { createComment } from "../services/entriesApi";
import { useToast } from "@chakra-ui/react";


interface FormData {
  content: string;
}

interface CommentFormProps {
  entryId: number;
  onSuccess: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ entryId, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const toast = useToast();


  const onSubmit = async (data: FormData) => {
    try {
      // Call your API to create the comment for the entry with the given entryId
      await createComment(entryId, data.content);
      reset();
      onSuccess();
  
      toast({
        title: "Comment created",
        description: "Your comment has been successfully created.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
  
      toast({
        title: "Error creating comment",
        description: "There was an error creating your comment. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel htmlFor="content">Comment:</FormLabel>
        <Textarea {...register("content")} id="content" />
      </FormControl>
      <Button type="submit" colorScheme="teal" mt={4}>
        Submit
      </Button>
    </Box>
  );
};

export default CommentForm;
