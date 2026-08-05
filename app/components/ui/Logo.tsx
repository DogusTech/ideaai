import { FC } from 'react';

interface Props {}

const Logo: FC<Props> = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <img src="https://source.unsplash.com/800x600/?corporate,office,technology" />
    </div>
  );
};

export default Logo;