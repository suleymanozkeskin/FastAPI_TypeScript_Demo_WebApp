// src/pages/forum/entries/username/[username].tsx

import React, { useEffect, useState ,useCallback} from 'react';
import { useRouter } from 'next/router';
import { Box, VStack, Button, HStack,useColorModeValue } from '@chakra-ui/react';
import Entry from '../../../../components/Entry';
import { EntryType } from '../../../../components/types';
import { getEntriesbyUsername } from '../../../../services/entriesApi';
import Topbar from '@/components/Topbar';
import { useToast } from '@chakra-ui/react';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import Tagbar from '@/components/Tagbar';

const UserEntries: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const toast = useToast();

  const fetchEntries = useCallback(async (username: string, skip: number) => {
    const entries = await getEntriesbyUsername(username, skip);
    setEntries(entries);

    // Check if there are more entries to fetch and set the hasMore state
    if (entries.length < 10) {
      setHasMore(false);
      if (skip > 0) {
        toast({
          title: 'End of entries',
          description: 'You have reached the end of entries.',
          status: 'info',
          duration: 3000,
          isClosable: true,
          position: 'bottom',
        });
      }
    } else {
      setHasMore(true);
    }
  }, [toast]);

  useEffect(() => {
    if (username) {
      fetchEntries(username as string, skip);
    }
  }, [username, skip, fetchEntries]);

  const handleBack = () => {
    setSkip(Math.max(skip - 10, 0));
  };

  const handleNext = () => {
    if (entries.length === 10) {
      setSkip(skip + 10);
    }
  };

  const handleTagSelection = (selectedTag: string) => {
    console.log("Selected tag:", selectedTag);
    // Navigate to the tag page
    router.push(`/forum/tags/${selectedTag}`);
  };

  return (
    <BackgroundWrapper>
      <Box minH="100vh">
        <Tagbar onSelectTag={handleTagSelection} />
        <VStack spacing={4} p={6} w="80%" m="auto">
          {entries.map((entry) => (
            <Entry key={entry.id} entry={entry} />
          ))}
          <HStack>
            <Button onClick={handleBack} disabled={skip === 0}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!hasMore}>
              Next
            </Button>
          </HStack>
        </VStack>
      </Box>
    </BackgroundWrapper>
  );
};

export default UserEntries;