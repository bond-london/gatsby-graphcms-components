import React from "react";
import { AutoVisualNoLottie, LottieElement } from ".";
import { VisualAsset } from "..";

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
