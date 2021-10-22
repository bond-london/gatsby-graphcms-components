import { IGatsbyImageData } from "gatsby-plugin-image";
import React, { useCallback, useEffect, useState } from "react";
import { Thumbnail, AutoVideo } from ".";

interface Props {
  videoSrc: string;
  alt: string;
  thumbnail: IGatsbyImageData;
  fitParent?: boolean;
  delay?: number;
  imageClassname?: string;
  videoClassname?: string;
}

export const AutoVideoAndThumbnail: React.FC<Props> = ({
  videoSrc,
  alt,
  thumbnail,
  fitParent,
  delay = 1000,
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
        alt={alt}
        fitParent={fitParent}
        onLoad={onImageLoadedOrErrored}
        onError={onImageLoadedOrErrored}
      />
      {showVideo && (
        <AutoVideo
          src={videoSrc}
          fitParent={fitParent}
          style={{ visibility: showVideo ? "unset" : "hidden" }}
        />
      )}
    </>
  );
};
