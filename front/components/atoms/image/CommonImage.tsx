import Image from "next/image";

function skeleton(w: number, h: number) {
  return `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#d1d5db" offset="20%" />
          <stop stop-color="#f3f4f6" offset="50%" />
          <stop stop-color="#d1d5db" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#d1d5db" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
    </svg>`;
}

function toBase64(str: string) {
  if (typeof window === "undefined") {
    return Buffer.from(str).toString("base64");
  } else {
    return window.btoa(str);
  }
}

const CommonImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}> = ({ src, alt, className = "", priority = false }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <Image
        src={src}
        fill
        alt={alt}
        style={{ objectFit: "cover" }}
        priority={priority}
        sizes="(min-width: 768px) 700px, 100vw"
        placeholder={`data:image/svg+xml;base64,${toBase64(skeleton(256, 128))}`}
      />
    </div>
  );
};

export default CommonImage;
