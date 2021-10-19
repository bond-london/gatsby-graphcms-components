import { useCallback, useEffect, useRef, useState } from "react";

export * from "./Visibility";

export function useTraceUpdate(props: { [key: string]: unknown }): void {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce(
      (ps: { [key: string]: [unknown, unknown] }, [k, v]) => {
        if (prev.current[k] !== v) {
          ps[k] = [prev.current[k], v];
        }
        return ps;
      },
      {}
    );
    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }
    prev.current = props;
  });
}

export function useDelayedTrigger(trigger: boolean, delay: number): boolean {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (trigger) {
      const handle = window.setTimeout(() => setDelayed(true), delay);
      return () => window.clearTimeout(handle);
    }
  }, [trigger, delay]);
  return delayed;
}

export function useOneShot(trigger: boolean): boolean {
  const [triggered, setTriggered] = useState(trigger);

  useEffect(() => {
    if (trigger) {
      setTriggered(true);
    }
  }, [trigger]);
  return triggered;
}

export function useDelayedOneShot(trigger: boolean, delay: number): boolean {
  const oneShot = useOneShot(trigger);
  const delayed = useDelayedTrigger(oneShot, delay);
  return delayed;
}

export function useComponentSize<T extends HTMLElement>(): [
  React.RefObject<T>,
  number[]
] {
  const componentRef = useRef<T>(null);
  const [size, setSize] = useState([375, 667]);
  const updateSize = useCallback(() => {
    const component = componentRef.current;
    if (component) {
      const { clientWidth, clientHeight } = component;
      setSize((oldSize) => {
        const [oldWidth, oldHeight] = oldSize;
        if (oldWidth !== clientWidth || oldHeight !== clientHeight) {
          return [clientWidth, clientHeight];
        }
        return oldSize;
      });
    }
  }, []);

  useEffect(() => {
    window.onresize = updateSize;
    updateSize();
    return () => {
      window.onresize = null;
    };
  }, [updateSize]);

  return [componentRef, size];
}
