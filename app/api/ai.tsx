import { FC } from 'react';
import CorporateBackground from '../../components/ui/CorporateBackground';

interface Props {
  children: React.ReactNode;
}

const AiLandingPage: FC<Props> = ({ children }) => {
  return (
    <CorporateBackground>
      {children}
    </CorporateBackground>
  );
}

export default AiLandingPage;