import type { SVGRendererConfig } from "lottie-web";
import React, {
  CSSProperties,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const LottiePlayer = lazy(() => import("./LottiePlayer"));

import { InternalVisualComponentProps } from ".";
import { LottieInformation } from "../utils";

interface Props extends Partial<InternalVisualComponentProps> {
  animation: LottieInformation;
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
    animation,
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
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

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

  const imgSrc = animation.encoded || animation.encodedUrl;

  return (
    <div ref={containerRef} className={className} style={fullStyles}>
      <img
        alt={alt}
        ref={imgRef}
        src={imgSrc}
        decoding="async"
        loading="lazy"
        width={animation.width}
        height={animation.height}
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
      {isClient && (
        <LottiePlayer
          containerRef={containerRef}
          imgRef={imgRef}
          debug={debug}
          animationUrl={animation.animationUrl}
          rendererSettings={rendererSettings}
          loop={loop}
          loopDelay={loopDelay}
          objectFit={objectFit}
          disabled={disabled}
          threshold={threshold}
          delay={delay}
        />
      )}
    </div>
  );
};
