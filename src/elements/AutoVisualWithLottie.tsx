import React from "react";
import { VisualAsset } from "..";
import { AutoVisualNoLottie } from "./AutoVisualNoLottie";
import { LottieElement } from "./LottieElement";

export const AutoVisualWithLottie: React.FC<{
  visual?: VisualAsset;
  className?: string;
  fitParent?: boolean;
}> = ({ visual, className, fitParent }) => {
  if (!visual) {
    return null;
  }

  const { animation, alt, loop } = visual;
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
      fitParent={fitParent}
    />
  );
};
