import React from 'react';
import CorporateBackgroundImage from './CorporateBackgroundImage';

const CorporateBackground = () => {
  return (
    <div className="bg-white/10 backdrop-blur-sm h-screen w-screen flex justify-center items-center">
      <CorporateBackgroundImage />
    </div>
  );
};

export default CorporateBackground;