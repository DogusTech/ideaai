import { Image } from 'next/image';

export default function CorporateImage() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-white/10 backdrop-blur-sm">
      <Image src="https://source.unsplash.com/800x600/?corporate,office,technology" alt="Corporate Image" width={800} height={600} layout="fill" objectFit="cover" />
    </div>
  );
}