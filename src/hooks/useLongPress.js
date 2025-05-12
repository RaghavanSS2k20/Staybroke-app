import { useCallback, useRef, useState } from "react";

const useLongPress = (
  onLongPress,
  { shouldPreventDefault = true, delay = 300 } = {}
) => {
  const timeout = useRef();
  const target = useRef();

  const start = useCallback(
    event => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false
        });
        target.current = event.target;
      }

      timeout.current = setTimeout(() => {
        onLongPress(event);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
    if (shouldPreventDefault && target.current) {
      target.current.removeEventListener("touchend", preventDefault);
    }
  }, [shouldPreventDefault]);

  return {
    onMouseDown: e => start(e),
    onTouchStart: e => start(e),
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear
  };
};

const isTouchEvent = event => {
  return "touches" in event;
};

const preventDefault = event => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

export default useLongPress;
