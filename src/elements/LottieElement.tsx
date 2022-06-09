import type { SVGRendererConfig } from "lottie-web";
import React, { CSSProperties, lazy, Suspense, useMemo, useRef } from "react";

const LottiePlayer = lazy(() => import("./LottiePlayer"));

import { InternalVisualComponentProps } from ".";

interface Props extends Partial<InternalVisualComponentProps> {
  animationUrl: string;
  encoded: string;
  rendererSettings?: SVGRendererConfig;
  placeholderClassName?: string;
  loop?: boolean;
  debug?: boolean;
  disabled?: boolean;
  alt: string;
  loopDelay?: number;
}

export const LottieElement: React.FC<Props> = (props) => {
  const {
    animationUrl,
    encoded,
    className,
    rendererSettings,
    placeholderClassName,
    loop = false,
    debug,
    disabled,
    alt,
    fitParent,
    loopDelay,
    objectFit,
    objectPosition,
    style,
    visualStyle,
    threshold,
    delay,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  debug && console.log("container ref", !!containerRef.current);

  const fullStyles: CSSProperties = useMemo(() => {
    const shared: CSSProperties = fitParent
      ? {
          position: "absolute",
          width: "100%",
          height: "100%",
          left: "0",
          top: "0",
        }
      : {};
    return { ...shared, ...style };
  }, [fitParent, style]);

  return (
    <div ref={containerRef} className={className} style={fullStyles}>
      <img
        alt={alt}
        ref={imgRef}
        src={encoded}
        style={
          visualStyle || {
            height: "100%",
            width: "100%",
            objectFit,
            objectPosition,
          }
        }
        className={placeholderClassName}
      />
      <Suspense>
        <LottiePlayer
          containerRef={containerRef}
          imgRef={imgRef}
          debug={debug}
          animationUrl={animationUrl}
          rendererSettings={rendererSettings}
          loop={loop}
          loopDelay={loopDelay}
          objectFit={objectFit}
          disabled={disabled}
          threshold={threshold}
          delay={delay}
        />
      </Suspense>
    </div>
  );
};
