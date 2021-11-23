import React from "react";
import { AutoVideoOrThumbnail, LottieElement, SvgIcon } from ".";
import { VisualAsset } from "..";

export const AutoVisualNoLottie: React.FC<{
  visual?: VisualAsset;
  className?: string;
  loop?: boolean;
  fitParent?: boolean;
}> = ({ visual, className, loop, fitParent }) => {
  if (!visual) {
    return null;
  }
  const { image, svg, animation, videoUrl, alt } = visual;
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
      />
    );
  }

  return (
    <AutoVideoOrThumbnail
      videoSrc={videoUrl}
      alt={alt}
      thumbnail={image}
      fitParent={fitParent}
      loop={loop}
      className={className}
    />
  );
};

export const AutoVisual: React.FC<{
  visual?: VisualAsset;
  className?: string;
  loop?: boolean;
  fitParent?: boolean;
}> = ({ visual, className, loop, fitParent }) => {
  if (!visual) {
    return null;
  }

  const { animation, alt } = visual;
  if (animation) {
    return (
      <LottieElement
        animationJson={animation.animationJson}
        encoded={animation.encoded}
        className={className}
        loop={loop}
        fitParent={fitParent}
        alt={alt}
      />
    );
  }

  return (
    <AutoVisualNoLottie
      visual={visual}
      className={className}
      loop={loop}
      fitParent={fitParent}
    />
  );
};
