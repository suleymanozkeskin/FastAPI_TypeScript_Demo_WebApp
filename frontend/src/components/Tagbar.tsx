import React from "react";
import {
  Box,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const tags = [
  "POLITICS",
  "ART",
  "HSRW",
  "MUSIC",
  "CINEMA",
  "LITERATURE",
  "ECONOMY",
  "SPORTS",
  "RELATIONSHIPS",
  "HISTORY",
  "SCIENCE",
  "FASHION",
  "HEALTH",
  "TROLL",
  "GERMAN",
  "EVENTS",
  "TRAVEL",
  "FOOD",
];

interface TagbarProps {
  onSelectTag: (tag: string) => void;
}

const Tagbar: React.FC<TagbarProps> = ({ onSelectTag }) => {
  const buttonBgColor = useColorModeValue("gray.200", "gray.700");
  const buttonHoverBgColor = useColorModeValue("gray.300", "gray.600");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleTagClick = (tag: string) => {
    onSelectTag(tag);
  };

  if (isMobile) {
    return (
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Select a tag
        </MenuButton>
        <MenuList>
          {tags.map((tag) => (
            <MenuItem key={tag} onClick={() => handleTagClick(tag)}>
              {tag}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  }

  const tagsPerRow = 12;
  const tagWidth = `${100 / tagsPerRow}%`;

  return (
    <Box>
      <Wrap
        py={2}
        px={{ base: 1, md: 4 }}
        spacing={2}
        width="100%"
        justifyContent="space-between"
      >
        {tags.map((tag) => (
          <WrapItem key={tag} flexGrow={1} width={tagWidth}>
            <Button
              onClick={() => onSelectTag(tag)}
              bgColor={buttonBgColor}
              _hover={{ bgColor: buttonHoverBgColor }}
              borderWidth="1px"
              borderRadius="lg"
              fontSize={{ base: "sm", md: "md" }}
              width="100%"
              justifyContent="center"
            >
              {tag}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default Tagbar;
