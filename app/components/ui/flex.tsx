import { FC } from 'react';
import { Flex } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

const FlexComponent: FC<Props> = ({ children }) => {
  return (
    <Flex>{children}</Flex>
  );
};

export default FlexComponent;
