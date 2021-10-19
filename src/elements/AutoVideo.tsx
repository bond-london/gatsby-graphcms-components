import classNames from 'classnames';
import React, {SyntheticEvent, useCallback, useEffect, useRef, useState} from 'react';
import {onVisibleToUser} from '../hooks/Visibility';

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
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onLoad?: () => void;
  onClick?: () => void;
  onVisible?: (isVisible: boolean) => void;
  className?: string;
}

export const RealAutoVideo: React.FC<Props> = ({
  src,
  autoplay,
  muted,
  loop,
  onLoad,
  className,
  onClick,
  onVisible
}) => {
  const shouldPlayRef = useRef(autoplay || false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!src) {
    throw new Error('The src should be set');
  }

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const removeVisibility = onVisibleToUser(
      videoElement,
      (isVisible) => {
        if (isVisible) {
          if (videoElement.src && videoElement.paused && shouldPlayRef.current) {
            playVideo(videoElement);
          }
        } else {
          if (!videoElement.paused) {
            videoElement.pause();
          }
        }
        onVisible?.(isVisible);
      },
      0.4,
      100
    );

    return () => {
      if (!videoElement.paused) {
        videoElement.pause();
      }
      removeVisibility();
    };
  }, [onVisible]);

  const handleLoad = useCallback((ev: SyntheticEvent<HTMLVideoElement>) => {
    const video = ev.currentTarget;
    playVideo(video);
  }, []);

  const handlePlay = useCallback(() => {
    setHasPlayed(true);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (autoplay) {
      shouldPlayRef.current = true;
      if (!hasPlayed || videoElement.paused) {
        playVideo(videoElement);
      }
    } else {
      shouldPlayRef.current = false;
      if (!videoElement.paused) {
        videoElement.pause();
      }
    }
  }, [autoplay, hasPlayed]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={videoRef}
      className={classNames(
        'absolute overflow-hidden inline-block align-top w-full h-full left-0 top-0 object-cover',
        className
      )}
      src={src}
      preload="none"
      autoPlay={false}
      loop={loop}
      muted={muted}
      playsInline={true}
      onCanPlay={hasPlayed ? undefined : handleLoad}
      onPlay={hasPlayed ? undefined : handlePlay}
      onClick={onClick}
    />
  );
};

export const AutoVideo: React.FC<Props> = (props) => {
  if (!props.src) {
    console.error('no src');
    return null;
  }

  return RealAutoVideo(props);
};
