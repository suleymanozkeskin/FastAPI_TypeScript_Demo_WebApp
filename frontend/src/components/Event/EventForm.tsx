// src/components/Event/EventForm.tsx
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  VStack,
  HStack,
  Box,
  useToast,
} from '@chakra-ui/react';
import { createEvent } from '@/services/api/eventApi';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [tickets, setTickets] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const toast = useToast();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('date', date);
    formData.append('organizer_name', organizerName);
    formData.append('is_free', isFree.toString());
    
    if (!isFree) {
      formData.append('tickets', JSON.stringify(tickets));
    }
  
    images.forEach((image) => formData.append('image', image)); // Change 'images' to 'image'
  
    const response = await createEvent(formData);
    if (response) {
      toast({
        title: 'Event created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: 'Error creating event',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl id="eventTitle">
              <FormLabel>Title</FormLabel>
              <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl id="eventDescription">
              <FormLabel>Description</FormLabel>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </FormControl>
            <FormControl id="eventDate">
              <FormLabel>Date</FormLabel>
              <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            </FormControl>
            <FormControl id="organizerName">
              <FormLabel>Organizer Name</FormLabel>
              <Input type="text" value={organizerName} onChange={(e) => setOrganizerName(e.target.value)} />
            </FormControl>
            <HStack>
              <Checkbox isChecked={!isFree} onChange={() => setIsFree(!isFree)}>
                Paid Event
              </Checkbox>
              {!isFree && (
                <Box>
                  <Input
                    placeholder="Tickets JSON"
                    value={tickets}
                    onChange={(e) => setTickets(e.target.value)}
                  />
                </Box>
              )}
            </HStack>
            <FormControl id="eventImages">
              <FormLabel>Event Images</FormLabel>
              <Input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setImages(Array.from(e.target.files));
                  }
                }}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventForm;