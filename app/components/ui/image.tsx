import { FC } from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const ImageComponent: FC<Props> = ({ src, alt, width, height }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      layout='responsive'
      objectFit='cover'
      className='rounded-lg shadow-md'
    />
  );
};

export default ImageComponent;