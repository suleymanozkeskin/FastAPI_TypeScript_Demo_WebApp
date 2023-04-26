import React from 'react';
import EventForm from "@/components/Event/EventForm"

const CreateEvent: React.FC = () => {
  const handleSuccess = (event) => {
    console.log('Event created:', event);
  };

  const handleError = (error) => {
    console.error('Error creating event:', error);
  };

  return (
    <div>
      <h1>Create Event</h1>
      <EventForm onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default CreateEvent;
