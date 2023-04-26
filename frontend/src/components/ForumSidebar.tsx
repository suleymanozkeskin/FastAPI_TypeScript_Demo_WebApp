// src/components/ForumSidebar.tsx
import React, { ReactNode } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiHeart,
  FiThumbsDown,
  FiMenu,
} from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { IconType } from 'react-icons';
import { ReactText } from 'react';


interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Profile', icon: CgProfile,  },
  { name: 'Home', icon: FiHome },
  { name: 'Trending', icon: FiTrendingUp },
  { name: 'All Time Faved', icon: FiHeart },
  { name: 'All Time Hated', icon: FiThumbsDown },
];

export default function ForumSidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('gray.100', 'gray.800');
  return (
    <Box minH="100vh" bg={bg}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box
        ml={{ base: 0, md: 60 }} // Set the marginLeft value to match the width of the ForumSidebar
        pt="20" // Add paddingTop to align the content below the MobileNav
        px={{ base: 4, md: 0 }} // Add paddingLeft on mobile, and set it to 0 on larger screens
      >
        {children}
      </Box>
    </Box>
  );
}


interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Box
      bg={bg}
      borderRight="1px"
      borderRadius={{ base: '0', sm: 'md' }} // Add borderRadius for small devices and up
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60, sm: 48 }} // Adjust the width for small devices here
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="20"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        <Text fontSize="lg">{children}</Text>
      </Flex>
    </Link>
  );
};
  
  interface MobileProps extends FlexProps {
    onOpen: () => void;
  }
  const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const bg = useColorModeValue('white', 'gray.900');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.900', 'gray.100');
  
    return (
      <Flex
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={bg}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent="center"
      maxWidth="100%"
        {...rest}>
        <IconButton
          variant="outline"
          onClick={onOpen}
          aria-label="open menu"
          icon={<FiMenu />}
        />
        <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold" color={textColor}>
          Menu
        </Text>
      </Flex>
    );
  };
  
