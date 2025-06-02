
import { useEffect } from 'react';

export const useViewportZoomPrevention = () => {
  useEffect(() => {
    // Prevent zoom on mount and add input focus handling
    const viewport = document.querySelector('meta[name=viewport]');
    const originalContent = viewport?.getAttribute('content');
    
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Prevent pinch zoom
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent zoom on input focus
    const preventInputZoom = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
      }
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('focusin', preventInputZoom);
    document.addEventListener('focusout', preventInputZoom);

    return () => {
      // Restore original viewport on unmount
      if (viewport && originalContent) {
        viewport.setAttribute('content', originalContent);
      }
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('focusin', preventInputZoom);
      document.removeEventListener('focusout', preventInputZoom);
    };
  }, []);
};
