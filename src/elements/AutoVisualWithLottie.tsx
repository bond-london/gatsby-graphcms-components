import { SVGRendererConfig } from "lottie-web";
import React from "react";
import { AutoVisualProps } from ".";
import {
  AutoVisualNoLottie,
  DefaultVisualComponentProps,
} from "./AutoVisualNoLottie";
import { LottieElement } from "./LottieElement";

export const AutoVisualWithLottie: React.FC<
  Partial<
    AutoVisualProps & {
      loopDelay?: number;
      rendererSettings?: SVGRendererConfig;
    }
  >
> = ({
  visual,
  className,
  fitParent,
  loopDelay,
  rendererSettings,
  noStyle,
  objectFit = DefaultVisualComponentProps.objectFit,
  objectPosition,
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
      objectFit={objectFit}
      objectPosition={objectPosition}
      style={style}
      threshold={threshold}
      delay={delay}
      visualStyle={visualStyle}
    />
  );
};
