import Image from 'next/image';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full md:w-1/2">
      <Image
        src={src}
        alt={alt}
        width={600}
        height={600}
        className="rounded-lg"
      />
    </div>
  );
}
