import React, { useEffect, useRef, useState } from "react";

export function onVisibleToUser(
  element: HTMLElement,
  callback: (isVisible: boolean) => void,
  threshold?: number,
  delay?: number
): () => void {
  const realThreshold = undefined === threshold ? 0.2 : threshold;
  const realDelay = undefined === delay ? 10 : delay;

  let timeoutHandle: number | undefined;
  let isVisible: boolean | undefined;
  let lastNotified: boolean | undefined;

  const notify = () => {
    const isPageVisible = document.visibilityState === "visible";
    const isFullyVisible = isVisible && isPageVisible;
    if (isFullyVisible !== lastNotified) {
      lastNotified = isFullyVisible;
      callback(lastNotified || false);
    }
  };

  const handle = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.target === element) {
        const aboveThreshold = realThreshold
          ? entry.intersectionRatio >= realThreshold
          : entry.intersectionRatio > realThreshold;
        if (aboveThreshold !== isVisible) {
          isVisible = aboveThreshold;
        }
        timeoutHandle = window.setTimeout(() => {
          timeoutHandle = undefined;
          notify();
        }, realDelay);
      }
    });
  };

  const eventOptions: AddEventListenerOptions = { passive: true };
  document.addEventListener("visibilitychange", notify, eventOptions);

  const observer = new IntersectionObserver(handle, {
    threshold: realThreshold,
  });
  observer.observe(element);
  return () => {
    if (timeoutHandle) {
      window.clearTimeout(timeoutHandle);
      timeoutHandle = undefined;
    }
    observer.disconnect();
    document.removeEventListener("visibilitychange", notify, eventOptions);
  };
}

export function useFirstVisibleToUser<T extends HTMLElement>(
  threshold = 0.4,
  delay = 100
): [React.RefObject<T>, boolean] {
  const elementRef = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const removeVisibility = onVisibleToUser(
      element,
      (isVisible) => {
        if (isVisible) {
          setVisible(true);
          removeVisibility();
        }
      },
      threshold,
      delay
    );

    return removeVisibility;
  }, [threshold, delay]);

  return [elementRef, visible];
}

export function useEntryAnimation<T extends HTMLElement>(
  threshold?: number,
  delay?: number
): [React.RefObject<T>, string] {
  const [refObject, visible] = useFirstVisibleToUser<T>(threshold, delay);
  const animationMode = visible ? "animation-running" : "animation-paused";
  return [refObject, animationMode];
}

const animationDelays = [
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
  "animation-delay-400",
  "animation-delay-500",
  "animation-delay-600",
  "animation-delay-700",
  "animation-delay-800",
  "animation-delay-900",
  "animation-delay-1000",
];

export function calculateAnimationDelay(index: number): string {
  if (index < animationDelays.length) {
    return animationDelays[index];
  }
  return animationDelays[animationDelays.length - 1];
}
