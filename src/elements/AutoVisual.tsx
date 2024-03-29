import { SVGRendererConfig } from "lottie-web";
import React from "react";
import { AutoVisualProps } from ".";
import { calculateCropDetails } from "../utils";
import { AutoVisualNoLottie } from "./AutoVisualNoLottie";
import { LottieElement } from "./LottieElement";

export const AutoVisual: React.FC<
  Partial<
    AutoVisualProps & {
      loopDelay?: number;
      rendererSettings?: SVGRendererConfig;
    }
  >
> = ({
  visual,
  dontCrop,
  className,
  fitParent,
  loopDelay,
  rendererSettings,
  noStyle,
  style,
  threshold,
  delay,
  visualStyle,
}) => {
  if (!visual) {
    return null;
  }

  const { animation, alt, loop } = visual;
  if (animation) {
    const { objectFit, objectPosition } = calculateCropDetails(
      visual,
      dontCrop
    );
    return (
      <LottieElement
        animation={animation}
        className={className}
        loop={loop}
        fitParent={fitParent}
        alt={alt}
        loopDelay={loopDelay}
        rendererSettings={rendererSettings}
        objectFit={objectFit}
        objectPosition={objectPosition}
        noStyle={noStyle}
        style={style}
        visualStyle={visualStyle}
        threshold={threshold}
        delay={delay}
      />
    );
  }

  return (
    <AutoVisualNoLottie
      visual={visual}
      className={className}
      fitParent={fitParent}
      noStyle={noStyle}
      style={style}
      threshold={threshold}
      delay={delay}
      visualStyle={visualStyle}
      dontCrop={dontCrop}
    />
  );
};
