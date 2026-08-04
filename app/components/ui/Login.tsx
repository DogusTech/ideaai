.import { FC } from 'react';
import styles from './Login.module.css';

interface LoginProps {
  title: string;
}

const Login: FC<LoginProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <button>Login</button>
    </div>
  );
};

export default Login;