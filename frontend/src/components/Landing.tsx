// src/components/Landing.tsx
import React, { useState, useEffect } from "react";
import {Box,Button,Flex,useColorMode,useColorModeValue, Text, SimpleGrid, VStack, Center,ScaleFade,AlertDialog, AlertDialogBody, AlertDialogFooter,AlertDialogHeader,
AlertDialogContent,AlertDialogOverlay,Spacer} from "@chakra-ui/react";
import Link from "next/link";
import { logout } from "../services/api/api";
import Topbar from "./Topbar";

const Landing: React.FC = () => {
  const { colorMode } = useColorMode();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedInStatus === "true");
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  const handleComingSoon = () => {
    setIsOpen(true);
  };

  const cardBgGradientLight = "linear(to-tr, #C9D6FF, #E2E2E2)";
  const cardBgGradientDark = "linear(to-tr, teal.400, teal.600)";
  const cardBgGradient = useColorModeValue(
    cardBgGradientLight,
    cardBgGradientDark
  );
  const pageBgColorLight = "linear(to-tr, #C9D6FF, #E2E2E2)";
  const pageBgColorDark = "gray.800";
  const pageBgColor = useColorModeValue(pageBgColorLight, pageBgColorDark);

  const Card = ({ href, title, children, colorScheme, comingSoon = false }) => (
    <Center
      as={Link}
      href={comingSoon ? "#" : href}
      borderWidth={2}
      borderRadius="lg"
      p={6}
      w="100%"
      h="100%"
      _hover={{
        borderColor: "gray.600",
        boxShadow: "xl",
        transform: "scale(1.05)",
        zIndex: 1,
      }}
      position="relative"
      bgGradient={cardBgGradient}
      onClick={comingSoon ? handleComingSoon : null}
    >
      <VStack spacing={4} textAlign="center">
        <Button colorScheme={colorScheme} as="div" fontSize={["md", "md", "lg"]}>
          {title}
        </Button>
        <Text
          fontSize={["md", "md", "lg"]}
          fontWeight="semibold"
          color={useColorModeValue("gray.800", "white")}
        >
          {children}
        </Text>
      </VStack>
    </Center>
  );


  return (
    <Box bgGradient={pageBgColor} minH="calc(100vh - 64px)">
      <Spacer display={{ base: "block", md: "none" }} h="64px" />
      <Flex justifyContent="center" alignItems="center" h="80vh">
        <SimpleGrid
          columns={{ base: 1, sm: 1, md: 3 }}
          spacing={{ base: 4, sm: 8, md: 10 }}
          w="100%"
          maxW="1200px"
          p={4}
          minChildWidth="320px"
        >
          <Card href="/forum" title="Forum" colorScheme="teal">
            In this forum, only verified university students and staff can
            create entries, comments, and vote. Custom usernames give you the
            chance to stay anonymous and express yourself freely.
          </Card>
          <Card
            href="/events"
            title="Marketplace for Events"
            colorScheme="orange"
          >
            Find and promote events happening on and around your campus. Stay
            updated with the latest conferences, workshops, and parties, all in
            one place.
          </Card>
          <Card
            href="#"
            title="Marketplace for Students and Tutors"
            colorScheme="purple"
            comingSoon
          >
            Connect with fellow students and tutors to get help with your
            studies or offer your tutoring services. Collaborate and learn
            together in a secure and friendly environment.
          </Card>
        </SimpleGrid>
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Coming Soon
          </AlertDialogHeader>
          <AlertDialogBody>
            This feature is currently under development. Please come back later!
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
  
};

export default Landing;