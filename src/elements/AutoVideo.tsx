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

  const fullStyles: CSSProperties = useMemo(() => {
    const shared: CSSProperties = {
      objectFit: "cover",
    };
    const conditional: CSSProperties = fitParent
      ? {
          position: "absolute",
          width: "100%",
          height: "100%",
          left: "0",
          top: "0",
        }
      : { display: "block" };
    return { ...shared, ...conditional, ...style };
  }, [fitParent, style]);

  return (
    <video
      style={fullStyles}
      className={className}
      ref={videoRef}
      src={src}
      preload="none"
      autoPlay={false}
      loop={true}
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
