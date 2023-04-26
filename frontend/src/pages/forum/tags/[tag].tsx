// src/pages/forum/tags/[tag].tsx
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { getEntriesByTag } from "../../../services/entriesApi";
import { EntryType } from "../../../components/types";
import Entry from "../../../components/Entry";
import Tagbar from "@/components/Tagbar";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { VStack, Box, Button, HStack } from "@chakra-ui/react";

const TagPage: React.FC = () => {
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const { tag } = router.query;
  const [tagChanged, setTagChanged] = useState(false);

  const fetchEntriesByTag = useCallback(async (tag: string, skip: number) => {
    const entries = await getEntriesByTag(tag, skip);
    setEntries(entries);
    setHasMore(entries.length >= 10);
  }, []);

  useEffect(() => {
    if (tag) {
      setTagChanged(true);
    }
  }, [tag]);

  useEffect(() => {
    if (tag) {
      const skip = (page - 1) * 10; // Calculate the number of items to skip
      fetchEntriesByTag(tag as string, skip);
      if (tagChanged) {
        setPage(1);
        setTagChanged(false);
      }
    }
  }, [tag, page, fetchEntriesByTag, tagChanged]);

  const handleTagSelection = (selectedTag: string) => {
    console.log("Selected tag:", selectedTag);
    // Navigate to the tag page
    router.push(`/forum/tags/${selectedTag}`);
  };

  const handleNext = () => {
    console.log("Next button clicked");
    setPage(page + 1);
  };

  const handleBack = () => {
    setPage(Math.max(page - 1, 1));
  };

  const handleNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Next button clicked");
    handleNext();
    event.preventDefault();
  };

  return (
    <BackgroundWrapper>
      <Tagbar onSelectTag={handleTagSelection} />
      <VStack spacing={4} p={6} w="80%" m="auto">
        {entries.length === 0 && (
          <>
            <Box>There is no entry for this tag. Care to create one?</Box>
            <Button colorScheme="teal" onClick={() => router.push("/forum")}>
              Back to Forum
            </Button>
          </>
        )}
        {entries.map((entry) => (
          <Entry key={entry.id} entry={entry} />
        ))}
        <HStack>
          <Button onClick={handleBack} disabled={page === 1}>
            Back
          </Button>
          <Box
            onClick={handleNextClick}
            _hover={{  cursor: "pointer" }}
            borderRadius="md"
            p={2}
          >
            <Button disabled={!hasMore}>Next</Button>
          </Box>
        </HStack>
      </VStack>
    </BackgroundWrapper>
  );
};

export default TagPage;



/// Handling next button click does not work as it should. Click does not even put out a console.log.

