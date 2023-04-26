// src/components/Signup.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Flex,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signup } from '../services/api/api';
import { useAuth } from '../components/AuthContext';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setIsLoggedIn } = useAuth(); // Use the useAuth hook

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { success, error } = await signup(email, username, password);
    setLoading(false);

    if (success) {
      router.push('/login'); // Redirect to login page instead of setting isLoggedIn to true
    } else {
      const errorMessage = (error as any)?.detail?.[0]?.msg || 'Please check your information and try again.';
      alert(`Signup failed. ${errorMessage}`);
    }
  };

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.400", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Center minH="100vh" bgGradient={useColorModeValue("linear(to-br, gray.200, gray.300)", "linear(to-br, gray.800, gray.900)")}>
      <Box
        p={8} // Increased padding for more height
        boxShadow="2xl"
        borderRadius="md"
        w="30%" // Decreased width percentage
        minWidth="300px"
        maxWidth="400px" // Set a maximum width
        bg={bgColor}
        borderWidth={2}
        borderColor={borderColor}
      >
        <VStack spacing={6} alignItems="stretch">
          <Text fontSize="3xl" fontWeight="bold" textAlign="center" color="blue.600">
            Sign Up
          </Text>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormControl>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Text fontSize="sm" color={textColor} mt={1}>
              Choose your username wisely. If you wish to remain anonymous, do not use personally identifiable information.
            </Text>
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormControl>
          <Flex justifyContent="center">
            <Button
              colorScheme="blue"
              isLoading={loading}
              loadingText="Signing up"
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Center>
  );
};

export default Signup;
