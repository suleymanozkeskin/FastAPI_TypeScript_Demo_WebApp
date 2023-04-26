// src/components/BackgroundWrapper.tsx
import { Box, useColorModeValue } from '@chakra-ui/react';

interface BackgroundWrapperProps {
  fixedFooter?: boolean;
}

const BackgroundWrapper: React.FC<React.PropsWithChildren<BackgroundWrapperProps>> = ({
  children,
  fixedFooter,
}) => {
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  return (
    <Box
      bgColor={bgColor}
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      pb={fixedFooter ? { base: '68px', md: '80px' } : 0}
    >
      {children}
    </Box>
  );
};

export default BackgroundWrapper;
