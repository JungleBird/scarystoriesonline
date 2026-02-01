import { useRef, useState, useEffect, useCallback } from 'react';

// React hook for custom wheel scroll behavior
export default function useCustomWheelScroll(options = {}) {
  const scrollRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollSpeedMultiplier = options.scrollSpeedMultiplier || 0.2;

  // Memoized wheel handler
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (!scrollRef.current) return;
    const newScrollTop = scrollTop + (e.deltaY * scrollSpeedMultiplier);
    const maxScrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    setScrollTop(Math.max(0, Math.min(newScrollTop, maxScrollTop)));
  }, [scrollTop, scrollSpeedMultiplier]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  // Attach wheel event listener
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      node.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return scrollRef;
}