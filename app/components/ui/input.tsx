import { FC } from 'react';
import { Input } from '@chakra-ui/react';

interface Props {
  placeholder: string;
}

const InputComponent: FC<Props> = ({ placeholder }) => {
  return (
    <Input placeholder={placeholder} />
  );
};

export default InputComponent;
