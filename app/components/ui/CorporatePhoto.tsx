import { FC } from 'react';

interface Props {
  className?: string;
}

const CorporatePhoto: FC<Props> = ({ className }) => {
  return <div className="bg-white/10 backdrop-blur rounded-lg p-8 w-full h-full flex justify-center items-center relative">
    <img src="https://source.unsplash.com/800x600/?corporate,office,technology" className="object-cover w-full h-full absolute z-10" />
  </div>;
};

export default CorporatePhoto;