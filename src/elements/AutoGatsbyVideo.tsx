import {
  GatsbyTransformedVideo,
  GatsbyVideo,
} from "@bond-london/gatsby-transformer-video";
import React, { CSSProperties, useMemo } from "react";
import { InternalVisualComponentProps } from "./AutoVisualNoLottie";

export const AutoGatsbyVideo: React.FC<
  Partial<InternalVisualComponentProps> & {
    videoData: GatsbyTransformedVideo;
    noPoster?: boolean;
  } & React.DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >
> = ({
  fitParent,
  noStyle,
  style,
  videoData,
  noPoster,
  loop,
  objectFit,
  objectPosition,
  ...rest
}) => {
  const fullStyles: CSSProperties | undefined = useMemo(() => {
    if (noStyle) {
      return undefined;
    }
    const candidate: CSSProperties = fitParent
      ? {
          position: "absolute",
          width: "100%",
          height: "100%",
          left: "0",
          top: "0",
        }
      : { display: "block" };
    return { ...candidate, ...style };
  }, [fitParent, noStyle, style]);

  return (
    <GatsbyVideo
      videoData={videoData}
      noPoster={noPoster}
      style={fullStyles}
      autoPlay={true}
      loop={loop}
      objectFit={objectFit}
      objectPosition={objectPosition}
      {...rest}
    />
  );
};
