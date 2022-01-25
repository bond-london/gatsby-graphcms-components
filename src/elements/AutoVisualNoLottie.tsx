import React, { CSSProperties } from "react";
import { AutoVideoOrThumbnail, SvgIcon } from ".";
import { VisualAsset } from "..";

export const DefaultVisualComponentProps: Partial<VisualComponentProps> = {
  objectFit: "cover",
};

export interface VisualComponentProps {
  className: string;
  fitParent: boolean;
  noStyle: boolean;
  objectFit: CSSProperties["objectFit"];
  objectPosition: CSSProperties["objectPosition"];
  style: CSSProperties;
  threshold: number;
  delay: number;
}
export interface AutoVisualProps extends VisualComponentProps {
  visual?: VisualAsset;
}

export const AutoVisualNoLottie: React.FC<Partial<AutoVisualProps>> = ({
  visual,
  className,
  fitParent,
  noStyle,
  style,
  objectFit = DefaultVisualComponentProps.objectFit,
  objectPosition,
  threshold,
  delay,
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
        objectFit={objectFit}
        objectPosition={objectPosition}
        style={style}
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
