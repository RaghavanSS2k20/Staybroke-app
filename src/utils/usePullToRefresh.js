"use client"
import { useEffect } from "react";

// Dynamically import HammerJS outside of the function
let Hammer;

const loadHammer = async () => {
  Hammer = (await import("hammerjs")).default;
};

export default function PullToRefresh() {
  let hammer;
  const defaults = {
    contentEl: "content",
    ptrEl: "ptr",
    bodyEl: document.body,
    distanceToRefresh: 70,
    loadingFunction: false,
    resistance: 2.5,
  };

  let options = {};
  const pan = {
    enabled: false,
    distance: 0,
    startingPositionY: 0,
  };
  let bodyClass = defaults.bodyEl.classList;

  useEffect(() => {
    const init = () => {
      if (!Hammer) {
        return; // Exit if Hammer is not loaded yet
      }

      options = {
        contentEl: document.getElementById(defaults.contentEl),
        ptrEl: document.getElementById(defaults.ptrEl),
        bodyEl: defaults.bodyEl,
        distanceToRefresh: defaults.distanceToRefresh,
        loadingFunction: defaults.loadingFunction,
        resistance: defaults.resistance,
        hammerOptions: {},
      };

      if (!options.contentEl || !options.ptrEl) {
        return false;
      }

      bodyClass = options.bodyEl?.classList;
      hammer = new Hammer(options.contentEl, options.hammerOptions);
      hammer.get("pan").set({ direction: Hammer.DIRECTION_VERTICAL });

      hammer.on("panstart", _panStart);
      hammer.on("pandown", _panDown);
      hammer.on("panup", _panUp);
      hammer.on("panend", _panEnd);
    };

    // Load HammerJS and initialize
    loadHammer().then(init);

    // Cleanup function for removing event listeners (important for React/Next.js)
    return () => {
      if (hammer) {
        hammer.off("panstart", _panStart);
        hammer.off("pandown", _panDown);
        hammer.off("panup", _panUp);
        hammer.off("panend", _panEnd);
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount

  const _panStart = () => {
    pan.startingPositionY = options.bodyEl.scrollTop;

    if (pan.startingPositionY === 0) {
      pan.enabled = true;
    }
  };

  const _panDown = (e) => {
    if (!pan.enabled) {
      return;
    }

    e.preventDefault();
    pan.distance = e.distance / options.resistance;

    _setContentPan();
    _setBodyClass();
  };

  const _panUp = (e) => {
    if (!pan.enabled || pan.distance === 0) {
      return;
    }

    e.preventDefault();

    if (pan.distance < e.distance / options.resistance) {
      pan.distance = 0;
    } else {
      pan.distance = e.distance / options.resistance;
    }

    _setContentPan();
    _setBodyClass();
  };

  const _setContentPan = () => {
    if (options.contentEl) {
      options.contentEl.style.transform = `translate3d( 0, ${pan.distance}px, 0 )`;
    }
    options.ptrEl.style.transform = `translate3d( 0, ${pan.distance - options.ptrEl.offsetHeight}px, 0 )`;
  };

  const _setBodyClass = () => {
    if (pan.distance > options.distanceToRefresh) {
      bodyClass.add("ptr-refresh");
    } else {
      bodyClass.remove("ptr-refresh");
    }
  };

  const _panEnd = (e) => {
    if (!pan.enabled) {
      return;
    }

    e.preventDefault();

    if (options.contentEl) {
      options.contentEl.style.transform = "";
    }
    options.ptrEl.style.transform = "";

    if (options.bodyEl.classList.contains("ptr-refresh")) {
      _doLoading();
    } else {
      _doReset();
    }

    pan.distance = 0;
    pan.enabled = false;
  };

  const _doLoading = () => {
    bodyClass.add("ptr-loading");

    if (!options.loadingFunction) {
      return _doReset();
    }

    const loadingPromise = options.loadingFunction();

    setTimeout(() => {
      loadingPromise.then(_doReset);
    }, 1000);
  };

  const _doReset = () => {
    bodyClass.remove("ptr-loading");
    bodyClass.remove("ptr-refresh");
    bodyClass.add("ptr-reset");

    const bodyClassRemove = () => {
      bodyClass.remove("ptr-reset");
      options.bodyEl.removeEventListener("transitionend", bodyClassRemove, false);
    };

    options.bodyEl.addEventListener("transitionend", bodyClassRemove, false);
  };

  // Return the init function, so it can be called elsewhere
  return {
    init,
  };
}
