import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { onVisibleToUser } from "../hooks/Visibility";

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

interface Props {
  src: string;
  onLoad?: () => void;
  onClick?: () => void;
  onVisible?: (isVisible: boolean) => void;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
  delay?: number;
  fitParent?: boolean;
  loop?: boolean;
  noStyle?: boolean;
}

export const RealAutoVideo: React.FC<Props> = ({
  src,
  onLoad,
  className,
  style,
  onClick,
  onVisible,
  fitParent,
  threshold = 0.4,
  delay = 100,
  loop,
  noStyle,
}) => {
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

  const fullStyles: CSSProperties | undefined = useMemo(() => {
    if (noStyle) {
      return undefined;
    }
    const shared: CSSProperties = {
      objectFit: "cover",
      width: "100%",
      height: "100%",
    };
    const conditional: CSSProperties = fitParent
      ? {
          position: "absolute",
          left: "0",
          top: "0",
        }
      : { display: "block", position: "relative" };
    return { ...shared, ...conditional, ...style };
  }, [fitParent, style, noStyle]);

  return (
    <video
      style={fullStyles}
      className={className}
      ref={videoRef}
      src={src}
      preload="none"
      autoPlay={false}
      loop={loop}
      muted={true}
      playsInline={true}
      onPlay={hasPlayed ? undefined : handlePlay}
      onClick={onClick}
    />
  );
};

export const AutoVideo: React.FC<Props> = (props) => {
  if (!props.src) {
    console.error("no src");
    return null;
  }

  return RealAutoVideo(props);
};
