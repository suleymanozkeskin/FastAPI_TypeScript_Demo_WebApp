// src/components/Topbar.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  ButtonGroup,
  useColorModeValue,
  VStack,
  Spacer,
  Input,
} from "@chakra-ui/react";
import Link from "next/link";
import { logout } from "../services/api/api";
import { searchForum } from "../services/entriesApi";

import ColorModeToggle from "./ColorModeToggle";
import SearchResults from "./SearchResults";
import { CommentType, EntryType, SearchResult, TopbarProps, EntrySearchResult, CommentSearchResult } from "./types";

import { isClientSide } from "../utils/env";
import { useAuth } from './AuthContext';

const Topbar: React.FC<TopbarProps> = ({ searchResults, setSearchResults }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // Use the useAuth hook
  const inputTextColor = useColorModeValue("black", "white");

  useEffect(() => {
    if (isClientSide() && isLoggedIn !== null) {
      localStorage.setItem("isLoggedIn", String(isLoggedIn));
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
  };

  const handleSearchInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    console.log("Search query:", query);
  
    const results = await searchForum(query);
    console.log("Fetched results:", results);
  
    const mappedResults: (EntrySearchResult | CommentSearchResult)[] = results.map((result) => {
      if ('title' in result) {
        const entryResult: EntrySearchResult = {
          ...result,
          type: 'entry',
        };
        return entryResult;
      } else {
        const commentResult: CommentSearchResult = {
          ...result,
          type: 'comment',
        };
        return commentResult;
      }
    });
    console.log("Mapped results:", mappedResults);
    setSearchResults(mappedResults);
  };
  
  return (
    <VStack spacing={4} alignItems="stretch" bg="gray.500" p={4} position="relative" maxWidth="100%" > 
      <Flex justifyContent="space-between" alignItems="center">
        <Box mr="auto">
          <Link href="/">HSRW</Link>
        </Box>
        <Flex alignItems="center">
          <Box position="relative" maxWidth="100%" alignItems="center">
            <Box position="relative">
              <Input
                id="search-input"
                placeholder="Search"
                maxW="400px"
                color={inputTextColor}
                bg={useColorModeValue("white", "gray.700")}
                onChange={handleSearchInputChange}
              />
              <Box position="absolute" left={0} top={12}>
                <SearchResults searchResults={searchResults} />
              </Box>
            </Box>
          </Box>
          <Spacer minW="4" /> {/* Move the spacer outside the Box */}
          <ColorModeToggle />
          {isLoggedIn === null ? null : isLoggedIn ? (
            <Button colorScheme="red" onClick={handleLogout} ml={4}>
              Logout
            </Button>
          ) : (
            <ButtonGroup ml={4}>
              <Link href="/signup">
                <Button colorScheme="blue">Sign Up</Button>
              </Link>
              <Link href="/login">
                <Button colorScheme="teal">Login</Button>
              </Link>
            </ButtonGroup>
          )}
        </Flex>
      </Flex>
    </VStack>
  );
  
};

export default Topbar;