import Link from 'next/link';

export const DashboardLink = ({ children, href }) => {
  return <Link href={href}>{children}</Link>;
};