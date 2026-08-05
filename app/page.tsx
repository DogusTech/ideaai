import { FC } from 'react';
import { Image } from 'next/image';
import { VStack, HStack, Box, Flex } from '@chakra-ui/react';
import ImageComponent from './image';
import LinkComponent from './link';
import ButtonComponent from './button';
import InputComponent from './input';
import TextComponent from './text';
import VStackComponent from './vstack';
import HStackComponent from './hstack';
import BoxComponent from './box';
import FlexComponent from './flex';

interface Props {
  children: React.ReactNode;
}

const PageComponent: FC<Props> = ({ children }) => {
  return (
    <VStack>
      <ImageComponent src="https://source.unsplash.com/800x600/?corporate,office,technology" alt="TogetLink Logo" />
      <HStack>
        <LinkComponent href="/ai">AI Dashboard</LinkComponent>
        <ButtonComponent>Register</ButtonComponent>
        <InputComponent placeholder="Email" />
        <TextComponent>Forgot Password?</TextComponent>
      </HStack>
      <Box>
        {children}
      </Box>
      <Flex>
        <ButtonComponent>Log In</ButtonComponent>
        <ButtonComponent>Register</ButtonComponent>
      </Flex>
    </VStack>
  );
};

export default PageComponent;