import { IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import {
  AutoVideo,
  AutoVideoAndThumbnail,
  Thumbnail,
  VisualComponentProps,
} from ".";

interface Props extends Partial<VisualComponentProps> {
  videoSrc?: string;
  alt: string;
  thumbnail?: IGatsbyImageData;
  loop?: boolean;
}

export const AutoVideoOrThumbnail: React.FC<Props> = ({
  videoSrc,
  alt,
  thumbnail,
  fitParent,
  loop,
  className,
  noStyle,
  objectFit,
  objectPosition,
  style,
  threshold,
  delay,
}) => {
  if (videoSrc && thumbnail) {
    return (
      <AutoVideoAndThumbnail
        videoSrc={videoSrc}
        alt={alt}
        thumbnail={thumbnail}
        fitParent={fitParent}
        loop={loop}
        className={className}
        noStyle={noStyle}
        objectFit={objectFit}
        objectPosition={objectPosition}
        style={style}
        threshold={threshold}
        delay={delay}
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
        objectFit={objectFit}
        objectPosition={objectPosition}
        style={style}
        threshold={threshold}
        delay={delay}
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
        objectFit={objectFit}
        objectPosition={objectPosition}
        style={style}
        threshold={threshold}
        delay={delay}
      />
    );
  }

  return <div className={className}>No content</div>;
};
