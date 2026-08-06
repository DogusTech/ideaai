import { FC } from 'react';

interface Props {
  src: string;
}

const Image: FC<Props> = ({ src }) => {
  return <img src={src} />;
};

export default Image;