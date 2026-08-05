import { FC } from 'react';
import styles from './Logo.module.scss';

interface Props {
  text: string;
}

const Logo: FC<Props> = ({ text }) => {
  return (
    <div className={styles.logo}>
      <h1>{text}</h1>
    </div>
  );
};

export default Logo;