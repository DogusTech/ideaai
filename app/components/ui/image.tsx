import { FC } from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
}

const ImageComponent: FC<Props> = ({ src, alt }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
    />
  );
};

export default ImageComponent;