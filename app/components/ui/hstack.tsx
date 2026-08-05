import { FC } from 'react';
import { HStack } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

const HStackComponent: FC<Props> = ({ children }) => {
  return (
    <HStack>{children}</HStack>
  );
};

export default HStackComponent;