import { FC } from 'react';
import styles from './CorporateBackground.module.scss';

interface Props {
  children: React.ReactNode;
}

const CorporateBackground: FC<Props> = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};

export default CorporateBackground;