import { FC } from 'react';
import { Box } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

const BoxComponent: FC<Props> = ({ children }) => {
  return (
    <Box>{children}</Box>
  );
};

export default BoxComponent;