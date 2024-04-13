import Image from "next/image";

const CommonImage: React.FC<{src: string, alt:string, className?: string, priority?: boolean}> = ({src, alt, className="", priority}) => {
  return (
    <div className={`relative inline-block ${className}`} >
      <Image
        src={src}
        fill
        alt={ alt }
        style={{ objectFit: 'cover' }}
        priority
      />
    </div>
  );
}

export default CommonImage;