import Link from 'next/link';

export const NavLink = ({ children, href }) => {
  return <Link href={href}>{children}</Link>;
};