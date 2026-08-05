import { FC } from 'react';
import styles from './CorporateBackground.module.css';

const CorporateBackground: FC = () => {
  return (
    <div className={styles.container}>
      <img src="https://source.unsplash.com/800x600/?corporate,office,technology" />
    </div>
  );
};

export default CorporateBackground;