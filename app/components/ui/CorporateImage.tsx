import { FC } from 'react';
import Image from 'next/image';

interface CorporateImageProps {
  src: string;
}

const CorporateImage: FC<CorporateImageProps> = ({ src }) => {
  return (
    <Image
      src={src}
      width={800}
      height={600}
      className="mx-auto"
      alt="Corporate Image"
    />
  );
};

export default CorporateImage;