import classNames from 'classnames';
import {IGatsbyImageData} from 'gatsby-plugin-image';
import React, {useCallback, useEffect, useState} from 'react';
import {Thumbnail, AutoVideo} from '.';

interface Props {
  videoSrc: string;
  alt: string;
  thumbnail: IGatsbyImageData;
  fitParent?: boolean;
  delay?: number;
  loop?: boolean;
  muted?: boolean;
}

export const AutoVideoAndThumbnail: React.FC<Props> = ({
  videoSrc,
  alt,
  thumbnail,
  fitParent,
  delay,
  loop,
  muted
}) => {
  const [videoHasBeenVisible, setVideoHasBeenVisible] = useState(false);
  const onVideoVisible = useCallback((isVisible: boolean) => {
    if (isVisible) {
      setVideoHasBeenVisible(true);
    }
  }, []);
  const realDelay = delay || 100;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const onImageLoadedOrErrored = useCallback(() => setImageLoaded(true), []);

  useEffect(() => {
    if (imageLoaded && !showVideo) {
      const handle = setTimeout(() => setShowVideo(true), realDelay);
      return () => clearTimeout(handle);
    }
  }, [imageLoaded, showVideo, realDelay]);

  return (
    <>
      <Thumbnail
        image={thumbnail}
        alt={alt}
        fitParent={fitParent}
        onLoad={onImageLoadedOrErrored}
        onError={onImageLoadedOrErrored}
      />
      <AutoVideo
        src={videoSrc}
        className={classNames(!showVideo && 'invisible')}
        autoplay={showVideo}
        loop={loop}
        muted={muted}
      />
    </>
  );
};
