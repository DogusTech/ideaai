import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/ai">
      <a>
        <Image src="https://source.unsplash.com/800x600/?corporate,office,technology" />
      </a>
    </Link>
  );
}