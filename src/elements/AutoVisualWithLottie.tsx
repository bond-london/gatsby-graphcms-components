import { SVGRendererConfig } from "lottie-web";
import React from "react";
import { VisualAsset } from "..";
import { AutoVisualNoLottie } from "./AutoVisualNoLottie";
import { LottieElement } from "./LottieElement";

export const AutoVisualWithLottie: React.FC<{
  visual?: VisualAsset;
  className?: string;
  fitParent?: boolean;
  loopDelay?: number;
  rendererSettings?: SVGRendererConfig;
  cover?: boolean;
}> = ({ visual, className, fitParent, loopDelay, rendererSettings, cover }) => {
  if (!visual) {
    return null;
  }

  const { animation, alt, loop } = visual;
  if (animation) {
    return (
      <LottieElement
        animationUrl={animation.animationUrl}
        encoded={animation.encoded}
        className={className}
        loop={loop}
        fitParent={fitParent}
        alt={alt}
        loopDelay={loopDelay}
        rendererSettings={rendererSettings}
        cover={cover}
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
