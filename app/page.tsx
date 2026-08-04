import { AppRouter } from '@next/app';
import type { AppType } from '../types';

const App = () => {
  return <AppRouter Component={AppType} />;
};

export default App;