import { FC } from 'react';
import styles from './CorporateImage.module.scss';

interface CorporateImageProps {
  src: string;
}

const CorporateImage: FC<CorporateImageProps> = ({ src }) => {
  return (
    <div className={styles.container}>
      <img src={src} alt="Corporate Image" />
    </div>
  );
};

export default CorporateImage;