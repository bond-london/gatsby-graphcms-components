import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React, { CSSProperties, useCallback, useMemo } from "react";
import { VisualComponentProps } from ".";

interface Props extends Partial<VisualComponentProps> {
  image: IGatsbyImageData;
  alt: string;
  onLoad?: () => void;
  onError?: () => void;
  imgClassName?: string;
}

export const Thumbnail: React.FC<Props> = (props) => {
  const {
    image,
    onLoad,
    onError,
    alt,
    className,
    imgClassName,
    objectFit,
    objectPosition,
    noStyle,
    fitParent,
    style,
  } = props;
  const handleStartLoad = useCallback(
    ({ wasCached }: { wasCached?: boolean }) => {
      if (wasCached) {
        onLoad?.();
      }
    },
    [onLoad]
  );

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
    <GatsbyImage
      objectFit={objectFit}
      objectPosition={objectPosition}
      image={image}
      style={fullStyles}
      alt={alt}
      onLoad={onLoad}
      onStartLoad={handleStartLoad}
      onError={onError}
      className={className}
      imgClassName={imgClassName}
    />
  );
};
