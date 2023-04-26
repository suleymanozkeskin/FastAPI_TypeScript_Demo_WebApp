// src/components/ShowPasswordInput.tsx
import React, { useState } from 'react';
import { Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface ShowPasswordInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ShowPasswordInput: React.FC<ShowPasswordInputProps> = ({ value, onChange }) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  return (
    <InputGroup>
      <Input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
      />
      <InputRightElement>
        <IconButton
          icon={show ? <ViewOffIcon /> : <ViewIcon />}
          size="sm"
          variant="ghost"
          onMouseDown={toggleShow}
          onMouseUp={toggleShow}
          aria-label={show ? 'Hide password' : 'Show password'}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default ShowPasswordInput;
