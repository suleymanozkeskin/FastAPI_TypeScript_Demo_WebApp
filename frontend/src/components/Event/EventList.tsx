// src/components/Event/EventList.tsx
import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { Event } from '../types';

interface EventListProps {
  events: Event[] | null;
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <Box>
      {(!events || events.length === 0) ? (
        <Text>No events found.</Text>
      ) : (
        Array.isArray(events) && events.map((event) => (
          // Render event component
          <Text key={event.id}>{event.title}</Text>
        ))
      )}
    </Box>
  );
};

export default EventList;
