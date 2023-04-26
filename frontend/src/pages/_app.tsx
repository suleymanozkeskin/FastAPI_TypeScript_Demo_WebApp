// src/pages/_app.tsx
import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Topbar from '../components/Topbar';
import { EntrySearchResult, CommentSearchResult }  from '../components/types';
import { AuthProvider } from '@/components/AuthContext';
import Footer from '../components/Footer';


function MyApp({ Component, pageProps }: AppProps) {
  const [searchResults, setSearchResults] = useState<(EntrySearchResult | CommentSearchResult)[]>([]);
  return (
    <ChakraProvider>
      <AuthProvider>
        <BackgroundWrapper>
          <Topbar searchResults={searchResults} setSearchResults={setSearchResults} />
          <Component {...pageProps} searchResults={searchResults} />
          <Footer />
        </BackgroundWrapper>
      </AuthProvider>
    </ChakraProvider>
  );
}


export default MyApp;