import { IGatsbyImageData } from "gatsby-plugin-image";
import React, { useCallback, useEffect, useState } from "react";
import { Thumbnail, AutoVideo, VisualComponentProps } from ".";

interface Props extends Partial<VisualComponentProps> {
  videoSrc: string;
  alt: string;
  thumbnail: IGatsbyImageData;
  loop?: boolean;
}

export const AutoVideoAndThumbnail: React.FC<Props> = ({
  videoSrc,
  alt,
  thumbnail,
  fitParent,
  threshold,
  delay = 1000,
  loop,
  noStyle,
  objectFit,
  objectPosition,
  className,
  style,
  visualStyle,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const onImageLoadedOrErrored = useCallback(() => setImageLoaded(true), []);

  useEffect(() => {
    if (imageLoaded) {
      const handle = setTimeout(() => setShowVideo(true), delay);
      return () => clearTimeout(handle);
    }
  }, [imageLoaded, delay]);

  return (
    <>
      <Thumbnail
        image={thumbnail}
        className={className}
        alt={alt}
        fitParent={fitParent}
        onLoad={onImageLoadedOrErrored}
        onError={onImageLoadedOrErrored}
        noStyle={noStyle}
        objectFit={objectFit}
        objectPosition={objectPosition}
        style={style}
        threshold={threshold}
        delay={delay}
        visualStyle={visualStyle}
      />
      {showVideo && (
        <AutoVideo
          className={className}
          src={videoSrc}
          fitParent={fitParent}
          loop={loop}
          noStyle={noStyle}
          objectFit={objectFit}
          objectPosition={objectPosition}
          threshold={threshold}
          delay={delay}
          style={style}
          visualStyle={visualStyle}
        />
      )}
    </>
  );
};
