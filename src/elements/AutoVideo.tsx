import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { InternalVisualComponentProps } from ".";
import { onVisibleToUser } from "../hooks/Visibility";

function useStyles(props: Partial<InternalVisualComponentProps>) {
  const {
    noStyle,
    objectFit,
    objectPosition,
    fitParent,
    style,
    visualStyle,
    width,
    height,
  } = props;
  return useMemo(() => {
    if (noStyle) {
      return undefined;
    }
    const shared: CSSProperties = {
      objectFit,
      objectPosition,
      width: width ? undefined : "100%",
      height: height ? undefined : "100%",
    };

    const conditional: CSSProperties = fitParent
      ? {
          position: "absolute",
          left: "0",
          top: "0",
        }
      : { display: "block", position: "relative" };
    return { ...shared, ...conditional, ...style, ...visualStyle };
  }, [
    noStyle,
    objectFit,
    objectPosition,
    fitParent,
    style,
    visualStyle,
    width,
    height,
  ]);
}

function playVideo(videoElement: HTMLVideoElement) {
  videoElement
    .play()
    .then(() => {
      videoElement.controls = false;
    })
    .catch((err) => {
      console.error(`cannot play ${videoElement.src}`, err);
      videoElement.controls = true;
    });
}

interface Props extends Partial<InternalVisualComponentProps> {
  src: string;
  loop?: boolean;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onClick?: () => void;
  onVisible?: (isVisible: boolean) => void;
}

export const AutoVideo: React.FC<Props> = (props) => {
  const {
    src,
    onLoad,
    className,
    onClick,
    onVisible,
    threshold = 0.4,
    delay = 100,
    loop,
    width,
    height,
  } = props;
  const [hasPlayed, setHasPlayed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!src) {
    throw new Error("The src should be set");
  }

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const removeVisibility = onVisibleToUser(
      videoElement,
      (isVisible) => {
        if (isVisible) {
          if (videoElement.src && videoElement.paused) {
            playVideo(videoElement);
          }
        } else {
          if (!videoElement.paused) {
            videoElement.pause();
          }
        }
        onVisible?.(isVisible);
      },
      threshold,
      delay
    );

    return () => {
      if (!videoElement.paused) {
        videoElement.pause();
      }
      removeVisibility();
    };
  }, [onVisible, threshold, delay]);

  const handlePlay = useCallback(() => {
    setHasPlayed(true);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  const fullStyles = useStyles(props);

  return (
    <video
      style={fullStyles}
      className={className}
      ref={videoRef}
      src={src}
      preload="auto"
      autoPlay={false}
      loop={loop}
      muted={true}
      playsInline={true}
      onPlay={hasPlayed ? undefined : handlePlay}
      onClick={onClick}
      width={width}
      height={height}
    />
  );
};
