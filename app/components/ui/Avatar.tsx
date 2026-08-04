import { FC } from 'react';
import { Box } from '@components/ui';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

const Avatar: FC<Props> = ({ size = 'md', src }) => {
  return (
    <Box
      className={`avatar ${size === 'sm' ? 'avatar-sm' : size === 'md' ? 'avatar-md' : 'avatar-lg'}`}
      bg='gray.200'
      rounded='full'
      overflow='hidden'
    >
      {src ? <img src={src} alt='Avatar' /> : <div className='avatar-placeholder' />}
    </Box>
  );
};

export default Avatar;