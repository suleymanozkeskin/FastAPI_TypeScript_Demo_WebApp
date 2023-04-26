// src/pages/events/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  Divider,
  Center,
  Grid,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import EventList from '../../components/Event/EventList';
import EventForm from '../../components/Event/EventForm';
import { getUpcomingEvents, getPastEvents } from '../../services/api/eventApi';

const EventsPage: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[] | null>(null);
  const [pastEvents, setPastEvents] = useState<Event[] | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedUpcomingEvents = await getUpcomingEvents();
      const fetchedPastEvents = await getPastEvents();
      setUpcomingEvents(fetchedUpcomingEvents);
      setPastEvents(fetchedPastEvents);
    };

    fetchEvents();
  }, []);

  return (
    <Box>
      <Center>
        <Heading as="h1" textAlign="center" my={4}>
          Events
        </Heading>
      </Center>
      <VStack spacing={10}>
        <Center>
          <Button onClick={onOpen} colorScheme="teal" mb={4}>
            Create Event
          </Button>
        </Center>
        <EventForm isOpen={isOpen} onClose={onClose} />
        <Divider borderColor="gray.200" borderWidth="1px" />
        <Grid templateRows="repeat(2, 1fr)" gap={6} h="full">
          <Box>
            <Heading as="h2" textAlign="center" mb={4}>
              Upcoming Events
            </Heading>
            <EventList events={upcomingEvents} />
          </Box>
          <Box>
            <Heading as="h2" textAlign="center" mb={4}>
              Past Events
            </Heading>
            <EventList events={pastEvents} />
          </Box>
        </Grid>
      </VStack>
    </Box>
  );
};

export default EventsPage;
