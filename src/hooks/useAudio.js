import { useRef, useCallback } from "react";
import useGameStore from "../store/useGameStore";

// One shared BGM audio element across all uses of this hook.
let bgmAudio = null;

/**
 * useBgm — manages looping background music.
 * Respects bgmEnabled from the global store.
 */
export const useBgm = () => {
  const bgmEnabled = useGameStore((s) => s.bgmEnabled);

  const play = useCallback(
    (src) => {
      if (!bgmEnabled) return;

      // If same track is already playing, do nothing
      if (
        bgmAudio &&
        !bgmAudio.paused &&
        bgmAudio.src.endsWith(
          encodeURIComponent(src.split("/").pop()).replace(/%2F/g, "/"),
        )
      ) {
        return;
      }

      // Stop any existing BGM
      if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
      }

      bgmAudio = new Audio(src);
      bgmAudio.loop = true;
      bgmAudio.volume = 0.45;
      bgmAudio.play().catch(() => {});
    },
    [bgmEnabled],
  );

  const stop = useCallback(() => {
    if (bgmAudio) {
      bgmAudio.pause();
      bgmAudio.currentTime = 0;
    }
  }, []);

  const setMuted = useCallback((muted) => {
    if (bgmAudio) bgmAudio.muted = muted;
  }, []);

  return { play, stop, setMuted };
};

/**
 * useSfx — plays a short one-shot sound effect.
 * Respects sfxEnabled from the global store.
 */
export const useSfx = () => {
  const sfxEnabled = useGameStore((s) => s.sfxEnabled);
  const sfxRef = useRef(null);

  const play = useCallback(
    (src) => {
      if (!sfxEnabled) return;
      sfxRef.current = new Audio(src);
      sfxRef.current.volume = 0.7;
      sfxRef.current.play().catch(() => {});
    },
    [sfxEnabled],
  );

  return { play };
};
