import { FC } from 'react';
import { Link } from 'next/link';

interface Props {
  href: string;
  children: React.ReactNode;
}

const LinkComponent: FC<Props> = ({ href, children }) => {
  return (
    <Link href={href}>{children}</Link>
  );
};

export default LinkComponent;
