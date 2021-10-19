import {GatsbyImage, IGatsbyImageData} from 'gatsby-plugin-image';
import React, {CSSProperties, useCallback, useMemo} from 'react';

interface Props {
  image: IGatsbyImageData;
  alt: string;
  onLoad?: () => void;
  onError?: () => void;
  fitParent?: boolean;
  className?: string;
}

export const Thumbnail: React.FC<Props> = ({image, onLoad, onError, alt, fitParent, className}) => {
  const handleStartLoad = useCallback(
    ({wasCached}: {wasCached?: boolean}) => {
      if (wasCached) {
        onLoad?.();
      }
    },
    [onLoad]
  );

  const style: CSSProperties = useMemo(
    () =>
      fitParent
        ? {
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: '0',
            top: '0'
          }
        : {display: 'block'},
    [fitParent]
  );
  return (
    <GatsbyImage
      objectFit="cover"
      image={image}
      style={style}
      alt={alt}
      onLoad={onLoad}
      onStartLoad={handleStartLoad}
      onError={onError}
      className={className}
    />
  );
};
