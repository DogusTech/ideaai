import { FC } from 'react';
import { Image } from '@components/ui/Image';

interface CorporateImageProps {
  src: string;
}

const CorporateImage: FC<CorporateImageProps> = ({ src }) => {
  return <Image src={src} />;
};

export default CorporateImage;