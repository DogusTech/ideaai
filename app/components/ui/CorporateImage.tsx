import { Image } from 'next/image';

export default function CorporateImage() {
  return (
    <div className="w-full h-screen bg-white/10 backdrop-blur-sm p-4">
      <Image
        src="https://source.unsplash.com/800x600/?corporate,office,technology"
        alt="Corporate Image"
        width={800}
        height={600}
        className="object-cover w-full h-full"
      />
    </div>
  );
}
