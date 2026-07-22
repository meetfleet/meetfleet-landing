import { createContext, useContext } from 'react';

// Holds the smoothed 0→1 scroll-progress MotionValue for the current StickyScene.
export const StickySceneContext = createContext(null);

export const useStickyScene = () => {
  const progress = useContext(StickySceneContext);
  if (!progress) {
    throw new Error('useStickyScene must be used inside a <StickyScene>');
  }
  return progress;
};
