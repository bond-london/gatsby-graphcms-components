import { IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import { AutoVideo, AutoVideoAndThumbnail, Thumbnail } from ".";

interface Props {
  videoSrc?: string;
  alt: string;
  thumbnail?: IGatsbyImageData;
  fitParent?: boolean;
  loop?: boolean;
  className?: string;
}

export const AutoVideoOrThumbnail: React.FC<Props> = ({
  videoSrc,
  alt,
  thumbnail,
  fitParent,
  loop,
  className,
}) => {
  if (videoSrc && thumbnail) {
    return (
      <AutoVideoAndThumbnail
        videoSrc={videoSrc}
        alt={alt}
        thumbnail={thumbnail}
        fitParent={fitParent}
        loop={loop}
        classname={className}
      />
    );
  }
  if (videoSrc) {
    return (
      <AutoVideo
        src={videoSrc}
        fitParent={fitParent}
        loop={loop}
        className={className}
      />
    );
  }

  if (thumbnail) {
    return (
      <Thumbnail
        image={thumbnail}
        alt={alt}
        fitParent={fitParent}
        className={className}
      />
    );
  }

  return <div className={className}>No content</div>;
};
