import { Layout } from "gatsby-plugin-image";
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
  const { noStyle, objectFit, objectPosition, fitParent, style, visualStyle } =
    props;
  return useMemo(() => {
    const videoStyle: CSSProperties = {
      objectFit,
      objectPosition,
      width: "100%",
      height: "100%",
      bottom: 0,
      margin: 0,
      maxWidth: "none",
      padding: 0,
      position: "absolute",
      right: 0,
      top: 0,
    };

    if (noStyle) {
      return { videoStyle, wrapperStyle: undefined };
    }

    const wrapperStyle: CSSProperties = fitParent
      ? {
          width: "100%",
          height: "100%",
          bottom: 0,
          margin: 0,
          maxWidth: "none",
          padding: 0,
          position: "absolute",
          right: 0,
          top: 0,
        }
      : { display: "block", position: "relative" };

    return {
      videoStyle,
      wrapperStyle: { ...wrapperStyle, ...style, ...visualStyle },
    };
  }, [noStyle, objectFit, objectPosition, fitParent, style, visualStyle]);
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
  layout?: Layout;
  onLoad?: () => void;
  onClick?: () => void;
  onVisible?: (isVisible: boolean) => void;
}

const Sizer: React.FC<{ width?: number; height?: number; layout?: Layout }> = ({
  layout,
  width,
  height,
}) => {
  if (layout && width && height) {
    if (layout === "fullWidth") {
      <div aria-hidden style={{ paddingTop: `${(height / width) * 100}%` }} />;
    }

    if (layout === "constrained") {
      return (
        <div style={{ maxWidth: width, display: `block` }}>
          <img
            alt=""
            role="presentation"
            aria-hidden="true"
            src={`data:image/svg+xml;charset=utf-8,%3Csvg height='${height}' width='${width}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
            style={{
              maxWidth: `100%`,
              display: `block`,
              position: `static`,
            }}
          />
        </div>
      );
    }
  }
  return null;
};

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
    layout,
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

  const { wrapperStyle, videoStyle } = useStyles(props);

  if (layout) {
    return (
      <div
        data-component="Constrained video"
        className={className}
        style={wrapperStyle}
      >
        <Sizer layout={layout} width={width} height={height} />
        <video
          style={videoStyle}
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
      </div>
    );
  }

  return (
    <video
      style={wrapperStyle}
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
