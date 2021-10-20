import { IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import { AutoVideo, AutoVideoAndThumbnail, Thumbnail } from ".";

interface Props {
  videoSrc?: string | null;
  alt?: string | null;
  thumbnail?: IGatsbyImageData | null;
  fitParent?: boolean;
}

export const AutoVideoOrThumbnail: React.FC<Props> = ({
  videoSrc,
  alt,
  thumbnail,
  fitParent,
}) => {
  const realAlt = alt || "Video/Image";
  if (videoSrc && thumbnail) {
    return (
      <AutoVideoAndThumbnail
        videoSrc={videoSrc}
        alt={realAlt}
        thumbnail={thumbnail}
        fitParent={fitParent}
      />
    );
  }
  if (videoSrc) {
    return <AutoVideo src={videoSrc} />;
  }

  if (thumbnail) {
    return <Thumbnail image={thumbnail} alt={realAlt} fitParent={fitParent} />;
  }

  throw new Error(`No content`);
};
