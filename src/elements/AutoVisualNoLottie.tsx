import React from "react";
import { AutoVideoOrThumbnail, SvgIcon } from ".";
import { VisualAsset } from "..";

export interface AutoVisualProps {
  visual?: VisualAsset;
  className?: string;
  fitParent?: boolean;
  noStyle?: boolean;
}

export const AutoVisualNoLottie: React.FC<AutoVisualProps> = ({
  visual,
  className,
  fitParent,
  noStyle,
}) => {
  if (!visual) {
    return null;
  }
  const { image, svg, animation, videoUrl, alt, loop } = visual;
  if (animation) {
    console.error("Lottie is not supported");
    return null;
  }

  if (svg) {
    return (
      <SvgIcon
        encoded={svg.encoded}
        alt={alt}
        fitParent={fitParent}
        className={className}
        noStyle={noStyle}
      />
    );
  }

  return (
    <AutoVideoOrThumbnail
      videoSrc={videoUrl}
      alt={alt}
      thumbnail={image}
      fitParent={fitParent}
      className={className}
      loop={loop}
      noStyle={noStyle}
    />
  );
};
