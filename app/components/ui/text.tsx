import { FC } from 'react';
import { Text } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

const TextComponent: FC<Props> = ({ children }) => {
  return (
    <Text>{children}</Text>
  );
};

export default TextComponent;