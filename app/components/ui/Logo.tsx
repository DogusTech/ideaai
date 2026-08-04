import { FC } from 'react';
import styles from './Logo.module.css';

interface LogoProps {
  title: string;
}

const Logo: FC<LogoProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <img src="https://source.unsplash.com/800x600/?corporate,office,technology" />
      <h1>{title}</h1>
    </div>
  );
};

export default Logo;