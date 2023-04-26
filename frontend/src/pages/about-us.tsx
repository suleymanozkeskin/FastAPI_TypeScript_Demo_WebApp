// src/pages/AboutUs.tsx
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  useColorModeValue,
  Icon,
  Stack,
} from '@chakra-ui/react';
import { RiTeamLine, RiExchangeDollarLine, RiChat1Line } from 'react-icons/ri';

const AboutUs: React.FC = () => {
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const dividerColor = useColorModeValue('gray.400', 'gray.600');

  return (
    <VStack
      as={Container}
      maxW="container.lg"
      py={{ base: 8, md: 12 }}
      spacing={{ base: 4, md: 6 }}
      alignItems="start"
      textAlign="justify"
    >
      <Heading as="h1" size="2xl" mb={4} color={headingColor}>
        About Us
      </Heading>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
      <Icon as={RiTeamLine} boxSize={12} />
        <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall">
          This website is created to serve students, staff, and alumni of Rhein-Waal University of Applied Sciences. We know that in an international university, people have different preferences on interacting on the web and social media. We see that the Facebook groups are not enough to gather everyone together and anyone can enter there. Here we will make sure only people are actually connected to our university will be able to join. We hope that this page will be the main point of interaction for everyone. There are often a lot of things going on in the university and people can talk and create awareness about things. They can even create trends with their entries and comments. Collectively, you will all have constant access to trends within our university.
        </Text>
      </Stack>
      <Divider borderColor={dividerColor} mt={6} mb={6} />
      <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
      <Icon as={RiChat1Line} boxSize={12} />
        <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall">
          Additionally, we hope that the freshmen will find this page very resourceful as they can read the experiences of others and have a better chance to connect with their fellow students when they arrive. Also, our professors, teaching assistants, and tutors will be able to speak up for whatever they wish to. We know that professors cannot be very direct or explicit as they would like to retain a serious figure, but here in this platform, they can still say whatever they wish to say, without exposing their identities.
        </Text>
      </Stack>
      <Divider borderColor={dividerColor} mt={6} mb={6} />
      <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
      <Icon as={RiExchangeDollarLine} boxSize={12} />
        <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall">
  Other than the forum, there will be a marketplace for tutors and students who would like to earn some extra bucks or get help with the classes. And finally, there will be a marketplace where you can create events and even sell tickets for it directly in this platform. We know some students are having a hard time in our university, but hopefully, we can make a good impact through this platform and improve the overall experience for everyone involved.
</Text>
      </Stack>
    </VStack>
  );
};

export default AboutUs;
