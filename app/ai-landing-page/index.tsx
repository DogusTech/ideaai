import { Image } from 'next/image';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <Image
        src="https://source.unsplash.com/800x600/?corporate,office,technology"
        alt="Corporate office background"
        width={800}
        height={600}
      />
    </div>
  );
}