// src/components/Footer.tsx
import React from "react";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { useColorModeValue } from "@chakra-ui/color-mode";

interface FooterProps {
    fixed?: boolean;
  }
  
  const Footer: React.FC<FooterProps> = ({ fixed }) => {
    return (
      <Box
        bg={useColorModeValue("blue.100", "gray.900")}
        py={4}
        position={fixed ? "fixed" : "relative"}
        bottom={0}
        width="100%"
      >
      <Flex
        justifyContent="space-around"
        alignItems="center"
        flexDirection={["column", "row"]}
      >
        <Link href="/about-us" _hover={{ textDecoration: "none" }}>
          <Text fontSize="lg" fontWeight="bold">
            About Us
          </Text>
        </Link>
        <Link
          href="https://github.com/suleymanozkeskin/FastAPI_TypeScript_Demo_WebApp"
          isExternal
        >
          <FaGithub size="1.5em" />
        </Link>
        <Text>© All rights reserved</Text>
      </Flex>
    </Box>
  );
};

export default Footer;
