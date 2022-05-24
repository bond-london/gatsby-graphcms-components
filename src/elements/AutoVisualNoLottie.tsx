import React, { CSSProperties } from "react";
import { AutoVideoOrThumbnail, SvgIcon } from ".";
import { VisualAsset } from "..";
import { calculateCropDetails } from "../utils";

export interface VisualComponentProps {
  className: string;
  fitParent: boolean;
  noStyle: boolean;
  style: CSSProperties;
  threshold: number;
  delay: number;
  visualStyle: CSSProperties;
  width?: number;
  height?: number;
}
export interface AutoVisualProps extends VisualComponentProps {
  visual: VisualAsset;
  dontCrop: boolean;
}
export interface InternalVisualComponentProps extends VisualComponentProps {
  objectFit: CSSProperties["objectFit"];
  objectPosition: CSSProperties["objectPosition"];
}

export const AutoVisualNoLottie: React.FC<Partial<AutoVisualProps>> = ({
  visual,
  dontCrop,
  className,
  fitParent,
  noStyle,
  style,
  threshold,
  delay,
  visualStyle,
}) => {
  if (!visual) {
    return null;
  }

  const { objectFit, objectPosition } = calculateCropDetails(visual, dontCrop);

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
        objectFit={objectFit}
        objectPosition={objectPosition}
        style={style}
        visualStyle={visualStyle}
        threshold={threshold}
        delay={delay}
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
      noStyle={noStyle}
      objectFit={objectFit}
      objectPosition={objectPosition}
      style={style}
      threshold={threshold}
      delay={delay}
      loop={loop}
    />
  );
};
