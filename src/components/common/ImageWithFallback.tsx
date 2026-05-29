import { useState } from 'react';
import type { IImageWithFallbackProps } from '../../types';
import fallBackImage from "../../assets/image-fallback.jpg"



const ImageWithFallback = ({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackSrc = fallBackImage
}: IImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);


  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;