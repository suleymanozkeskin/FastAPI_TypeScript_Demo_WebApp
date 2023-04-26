import React from 'react';
import { IconButton, IconButtonProps, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ColorModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = { light: 'gray.300', dark: 'gray.600' };
  const hoverBgColor = { light: 'gray.400', dark: 'gray.500' };
  const activeBgColor = { light: 'gray.500', dark: 'gray.400' };

  const icon: IconButtonProps['icon'] = colorMode === 'light' ? <FaMoon /> : <FaSun />;

  return (
    <IconButton
      aria-label="Toggle color mode"
      icon={colorMode === 'light' ? <FaMoon /> as React.ReactElement : <FaSun /> as React.ReactElement}
      onClick={toggleColorMode}
      bgColor={bgColor[colorMode]}
      _hover={{
        bgColor: hoverBgColor[colorMode],
      }}
      _active={{
        bgColor: activeBgColor[colorMode],
      }}
      borderRadius="md"
    />
  );
};

export default ColorModeToggle;
