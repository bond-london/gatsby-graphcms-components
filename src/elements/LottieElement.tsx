import { AnimationItem, SVGRendererConfig } from "lottie-web";
import React, {
  CSSProperties,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { onVisibleToUser } from "../hooks";
import lottie from "lottie-web/build/player/lottie_light";

interface Props {
  animationUrl: string;
  encoded: string;
  className?: string;
  rendererSettings?: SVGRendererConfig;
  placeholderClassName?: string;
  loop?: boolean;
  debug?: boolean;
  disabled?: boolean;
  fitParent?: boolean;
  alt: string;
  loopDelay?: number;
  cover?: boolean;
}

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

export const LottieElement: React.FC<Props> = (props) => {
  const {
    animationUrl,
    encoded,
    className,
    rendererSettings,
    placeholderClassName,
    loop = false,
    debug,
    disabled,
    alt,
    fitParent,
    loopDelay,
    cover,
  } = props;

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
            loadAnimation(animationUrl)
              .then((animationData) => {
                if (!state.cancelled) {
                  const realRendererSettings: SVGRendererConfig = {
                    ...(rendererSettings ? rendererSettings : {}),
                    ...(cover ? { preserveAspectRatio: "xMidYMid slice" } : {}),
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
      0.4,
      100
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
  }, [animationUrl, rendererSettings, debug, loop, loopDelay, cover]);

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

  const fullStyles: CSSProperties = useMemo(() => {
    return fitParent
      ? {
          position: "absolute",
          width: "100%",
          height: "100%",
          left: "0",
          top: "0",
        }
      : {};
  }, [fitParent]);

  return (
    <div ref={containerRef} className={className} style={fullStyles}>
      <img
        alt={alt}
        ref={imgRef}
        src={encoded}
        style={{
          height: "100%",
          width: "100%",
          objectFit: cover ? "cover" : "contain",
          objectPosition: "center",
        }}
        className={placeholderClassName}
      />
    </div>
  );
};
