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

interface Props {
  animationJson?: string;
  encoded?: string;
  className?: string;
  rendererSettings?: SVGRendererConfig;
  placeholderClassName?: string;
  loop?: boolean;
  debug?: boolean;
  disabled?: boolean;
  fitParent?: boolean;
  alt: string;
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
    loop = false,
    debug,
    disabled,
    alt,
    fitParent,
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
            import(/* webpackLoad: false */ "./LottieExport")
              .then((Lottie) => {
                if (!state.cancelled) {
                  const animationData = JSON.parse(
                    animationJson as string
                  ) as unknown;
                  state.animation = Lottie.default.loadAnimation({
                    container,
                    renderer: "svg",
                    autoplay: true,
                    loop,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    animationData,
                    rendererSettings,
                  });
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
              .catch((error) => {
                console.error("Failed to load lottie", error);
              });
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

  const fullStyles: CSSProperties = useMemo(() => {
    return fitParent
      ? {
          position: "absolute",
          width: "100%",
          height: "100%",
          left: "0",
          top: "0",
        }
      : { display: "block" };
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
          objectFit: "contain",
          objectPosition: "center",
        }}
        className={placeholderClassName}
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
