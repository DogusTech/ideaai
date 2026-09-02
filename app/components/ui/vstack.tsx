import { FC } from 'react';
import { VStack } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

const VStackComponent: FC<Props> = ({ children }) => {
  return (
    <VStack>{children}</VStack>
  );
};

export default VStackComponent;
