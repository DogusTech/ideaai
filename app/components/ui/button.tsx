import { FC } from 'react';
import { Button } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

const ButtonComponent: FC<Props> = ({ children }) => {
  return (
    <Button>{children}</Button>
  );
};

export default ButtonComponent;
