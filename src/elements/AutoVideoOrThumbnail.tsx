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
  noStyle?: boolean;
}

export const AutoVideoOrThumbnail: React.FC<Props> = ({
  videoSrc,
  alt,
  thumbnail,
  fitParent,
  loop,
  className,
  noStyle,
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
        noStyle={noStyle}
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
        noStyle={noStyle}
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
        noStyle={noStyle}
      />
    );
  }

  return <div className={className}>No content</div>;
};
