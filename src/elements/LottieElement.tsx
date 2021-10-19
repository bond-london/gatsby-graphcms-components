import classNames from "classnames";
import Lottie, { AnimationItem, SVGRendererConfig } from "lottie-web";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { onVisibleToUser, useTraceUpdate } from "../hooks";

interface Props {
  animationJson?: string;
  encoded?: string;
  className?: string;
  rendererSettings?: SVGRendererConfig;
  placeholderClassName?: string;
  loop?: boolean;
  debug?: boolean;
  disabled?: boolean;
}

interface InternalState {
  animation?: AnimationItem;
  cancelled?: boolean;
  loaded?: boolean;
  visible?: boolean;
}
const RealLottieElement: React.FC<Props> = (props) => {
  const {
    animationJson,
    encoded,
    className,
    rendererSettings,
    placeholderClassName,
    loop,
    debug,
    disabled,
  } = props;

  useTraceUpdate(debug ? (props as { [key: string]: unknown }) : {});
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [animation, setAnimation] = useState<AnimationItem>();
  const [visible, setVisible] = useState(false);

  debug && console.log("container ref", !!containerRef.current);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const state: InternalState = {};

    const removeVisibility = onVisibleToUser(
      container,
      (isVisible) => {
        if (isVisible) {
          if (!state.loaded) {
            debug && console.log("Loading");
            const animationData = JSON.parse(
              animationJson as string
            ) as unknown;
            state.animation = Lottie.loadAnimation({
              container,
              renderer: "svg",
              autoplay: true,
              loop: loop || false,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              animationData,
              rendererSettings,
            });
            setAnimation(state.animation);
            const img = imgRef.current;
            if (img && img.parentElement === container) {
              debug && console.log("Remove image");
              container.removeChild(img);
              (imgRef as MutableRefObject<HTMLImageElement | null>).current =
                null;
            }
            state.loaded = true;
          }
        }
        setVisible(isVisible);
      },
      0.4,
      100
    );

    return () => {
      debug && console.log("destroy animation");
      if (!state.cancelled) {
        state.cancelled = true;
        state.animation?.destroy();
        state.animation = undefined;
        setAnimation(undefined);
      }
      removeVisibility();
    };
  }, [animationJson, rendererSettings, debug, loop]);

  useEffect(() => {
    if (!animation) return;
    if (disabled) {
      if (!animation.isPaused) {
        animation.pause();
      }
      return;
    }

    if (visible) {
      if (animation.isPaused) {
        debug && console.log("play animation");
        animation.play();
      }
    } else {
      if (!animation.isPaused) {
        debug && console.log("pause animation");
        animation.pause();
      }
    }
  }, [animation, disabled, visible, debug]);

  return (
    <div ref={containerRef} className={className}>
      <img
        alt="Animation"
        ref={imgRef}
        src={encoded}
        className={classNames("h-full", placeholderClassName)}
      />
    </div>
  );
};

export const LottieElement: React.FC<Props> = (props) => {
  if (!props.animationJson) {
    return null;
  }
  return <RealLottieElement {...props} />;
};
