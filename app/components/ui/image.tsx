import { FC } from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
}

const CorporateImage: FC<Props> = ({ src, alt }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      className="mx-auto object-cover"
    />
  );
};

export default CorporateImage;