import Image from "next/image";

const CommonImage: React.FC<{src: string, alt:string, className?: string}> = ({src, alt, className=""}) => {
  return (
    <div className={`relative inline-block ${className}`} >
      <Image
        src={src}
        fill
        alt={ alt }
        style={{objectFit:'cover'}}
      />
    </div>
  );
}

export default CommonImage;