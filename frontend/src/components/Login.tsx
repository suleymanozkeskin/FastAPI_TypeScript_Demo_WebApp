import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { login } from "../services/api/api";
import { useAuth } from "../components/AuthContext";
import ShowPasswordInput from "./ShowPasswordInput";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setIsLoggedIn } = useAuth(); // Use the useAuth hook

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      setIsLoggedIn(true); // Update the state using the setIsLoggedIn from useAuth
      router.push("/");
    } else {
      alert("Login failed. Please check your email and password.");
    }
  };

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.400", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Center
      minH="100vh"
      bgGradient={useColorModeValue(
        "linear(to-br, gray.200, gray.300)",
        "linear(to-br, gray.800, gray.900)"
      )}
    >
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
          <Text
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
            color="teal.600"
          >
            Login
          </Text>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <ShowPasswordInput
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormControl>
          <Flex justifyContent="center">
            <Button
              colorScheme="teal"
              isLoading={loading}
              loadingText="Logging in"
              onClick={handleSubmit}
            >
              Login
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;
