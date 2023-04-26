// src/pages/index.tsx
import React from 'react';
import Landing from '../components/Landing';
import { ChakraProvider } from "@chakra-ui/react";
import App from './_app';
import { IconButton, useColorMode } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import BackgroundWrapper from '../components/BackgroundWrapper';
import Footer from '@/components/Footer';

const IndexPage: React.FC = () => {
  return (
    <BackgroundWrapper fixedFooter>
      <Landing />
      <Footer fixed />
    </BackgroundWrapper>
  );
};

export default IndexPage;