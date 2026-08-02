
import { Link } from 'next/link';

export default function Footer() {
  return (
    <footer>
      <p>&copy; TogetLink {new Date().getFullYear()}</p>
    </footer>
  );
};