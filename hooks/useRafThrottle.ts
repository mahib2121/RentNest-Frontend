"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * A callback that runs at most once per animation frame.
 *
 * High-frequency events — scroll, pointer move, resize — fire far more often
 * than the screen can be repainted. Reading a layout property or updating
 * state on every one of them costs more than it is worth: the browser queues
 * work that lands in the same frame anyway.
 *
 * This wrapper keeps only the most recent call and runs it on the next
 * frame, so a burst of events collapses into a single update.
 */
export function useRafThrottle<Args extends unknown[]>(
  callback: (...args: Args) => void,
) {
  const frameRef = useRef<number | null>(null);
  const latestArgs = useRef<Args | null>(null);
  const callbackRef = useRef(callback);

  /**
   * The ref is updated in an effect rather than during render. Writing a ref
   * during render is what React's `react-hooks/refs` rule forbids: the value
   * would change without the component being committed, so a render that is
   * thrown away could still have altered what the next frame calls.
   */
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttled = useCallback((...args: Args) => {
    latestArgs.current = args;

    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;

      if (latestArgs.current) {
        callbackRef.current(...latestArgs.current);
        latestArgs.current = null;
      }
    });
  }, []);

  /**
   * Cancel a pending frame when the component unmounts, so the callback
   * cannot fire against a component that is gone.
   */
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return throttled;
}
