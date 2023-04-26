import React from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { createEntry } from "../services/entriesApi";

interface FormData {
  title: string;
  content: string;
  tag: string;
}

interface CreateEntryFormProps {
  onSuccess: () => void;
}

const CreateEntryForm: React.FC<CreateEntryFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await createEntry({ title: data.title, content: data.content, tag: data.tag });
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting entry:", error);
    }
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value.toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input {...register("title", { required: true })} />
        </FormControl>
        <FormControl>
          <FormLabel>Content</FormLabel>
          <Textarea {...register("content", { required: true })} rows={10} />
        </FormControl>
        <FormControl>
          <FormLabel>Tag</FormLabel>
          <Input {...register("tag", { required: true })} onChange={handleTagChange} />
        </FormControl>
        <Box>
          <Button type="submit">Submit</Button>
        </Box>
      </VStack>
    </form>
  );
};

export default CreateEntryForm;
