import { AnimationItem, SVGRendererConfig } from "lottie-web";
import lottie from "lottie-web";

import React, {
  CSSProperties,
  Fragment,
  MutableRefObject,
  RefObject,
  useEffect,
  useState,
} from "react";
import { onVisibleToUser } from "../hooks";

interface InternalState {
  animation?: AnimationItem;
  cancelled?: boolean;
  loaded?: boolean;
  visible?: boolean;
  retriggerHandle?: number;
}

async function loadAnimation(url: string): Promise<unknown> {
  return await fetch(url).then(
    (response) => response.json() as Promise<unknown>
  );
}

const LottiePlayer: React.FC<{
  containerRef: RefObject<HTMLDivElement>;
  imgRef: RefObject<HTMLImageElement>;
  debug?: boolean;
  animationUrl: string;
  rendererSettings?: SVGRendererConfig;
  loop?: boolean;
  loopDelay?: number;
  objectFit: CSSProperties["objectFit"];
  disabled?: boolean;
  threshold?: number;
  delay?: number;
}> = ({
  containerRef,
  imgRef,
  debug,
  animationUrl,
  rendererSettings,
  loop,
  loopDelay,
  objectFit,
  disabled,
  threshold,
  delay,
}) => {
  const [animation, setAnimation] = useState<AnimationItem>();
  const [visible, setVisible] = useState(false);
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
            loadAnimation(animationUrl)
              .then((animationData) => {
                if (!state.cancelled) {
                  const realRendererSettings: SVGRendererConfig = {
                    ...(rendererSettings ? rendererSettings : {}),
                    ...(objectFit === "cover"
                      ? { preserveAspectRatio: "xMidYMid slice" }
                      : {}),
                  };
                  state.animation = lottie.loadAnimation({
                    container,
                    renderer: "svg",
                    autoplay: true,
                    loop,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    animationData,
                    rendererSettings: realRendererSettings,
                  });
                  if (loopDelay) {
                    state.animation?.addEventListener("complete", () => {
                      state.retriggerHandle = window.setTimeout(() => {
                        state.retriggerHandle = undefined;
                        state.animation?.goToAndPlay(0);
                      }, loopDelay);
                    });
                  }
                  setAnimation(state.animation);
                  const img = imgRef.current;
                  if (img && img.parentElement === container) {
                    debug && console.log("Remove image");
                    container.removeChild(img);
                    (
                      imgRef as MutableRefObject<HTMLImageElement | null>
                    ).current = null;
                  }
                  state.loaded = true;
                }
              })
              .catch((error) => console.error("Error loading", error));
          }
        }
        setVisible(isVisible);
      },
      threshold,
      delay
    );
    return () => {
      debug && console.log("destroy animation");
      if (!state.cancelled) {
        state.cancelled = true;
        if (state.retriggerHandle) {
          window.clearTimeout(state.retriggerHandle);
        }
        state.animation?.destroy();
        state.animation = undefined;
        setAnimation(undefined);
      }
      removeVisibility();
    };
  }, [
    animationUrl,
    rendererSettings,
    debug,
    loop,
    loopDelay,
    objectFit,
    containerRef,
    imgRef,
    threshold,
    delay,
  ]);

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

  return <Fragment />;
};

export default LottiePlayer;
