// src/components/SearchResults.tsx
import React from "react";
import {
  VStack,
  Text,
  Box,
  LinkBox,
  LinkOverlay,
  BoxProps,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { EntrySearchResult, CommentSearchResult } from "./types";

type SearchResultsProps = {
  searchResults: (EntrySearchResult | CommentSearchResult)[];
};

const customScrollbars: BoxProps = {
  css: {
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "20px",
      backgroundColor: "gray.400",
    },
  },
};

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults }) => {
  const textColor = useColorModeValue("black", "white");
  const bgColor = useColorModeValue("white", "gray.700");

  if (!searchResults || searchResults.length === 0) {
    return null;
  }
  

  return (
    <Box
      position="absolute"
      bg={bgColor}
      zIndex={10}
      mt={2}
      minWidth="250px"
      maxWidth="100%"
      maxH="300px"
      overflowY="scroll"
      boxShadow="sm"
      borderRadius="md"
      {...customScrollbars}
    >
      <VStack spacing={4} alignItems="flex-start" py={4} px={6}>
        {searchResults.map((result, index) =>
          result.type === "entry" ? (
            <LinkBox
              key={index}
              as="article"
              p="2"
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
              w="100%"
            >
              <Link href={`/forum/entries/${result.id}`} passHref>
                <LinkOverlay>
                  <Text fontSize="md" fontWeight="semibold" color={textColor}>
                    Entry: {result.title}
                  </Text>
                </LinkOverlay>
              </Link>
            </LinkBox>
          ) : (
            <LinkBox
              key={index}
              as="article"
              p="2"
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
              w="100%"
            >
              <Link href={`/forum/entries/${result.entry_id}#comment-${result.id}`} passHref>
                <LinkOverlay>
                  <Text fontSize="md" fontWeight="semibold" color={textColor}>
                    Comment: {result.content}
                  </Text>
                </LinkOverlay>
              </Link>
            </LinkBox>
          )
        )}
      </VStack>
    </Box>
  );
};

export default SearchResults;
