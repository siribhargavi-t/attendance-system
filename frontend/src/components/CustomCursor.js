import React, { useEffect, useRef, useCallback } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const followerPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const animate = useCallback(() => {
    if (!cursorRef.current || !followerRef.current) return;

    followerPosRef.current.x = lerp(followerPosRef.current.x, posRef.current.x, 0.12);
    followerPosRef.current.y = lerp(followerPosRef.current.y, posRef.current.y, 0.12);

    cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
    followerRef.current.style.transform = `translate(${followerPosRef.current.x}px, ${followerPosRef.current.y}px) translate(-50%, -50%)`;

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseEnterInteractive = () => {
      if (!cursorRef.current || !followerRef.current) return;
      cursorRef.current.style.width = '20px';
      cursorRef.current.style.height = '20px';
      cursorRef.current.style.background = '#8b5cf6';
      followerRef.current.style.width = '52px';
      followerRef.current.style.height = '52px';
      followerRef.current.style.borderColor = 'rgba(139,92,246,0.6)';
    };

    const onMouseLeaveInteractive = () => {
      if (!cursorRef.current || !followerRef.current) return;
      cursorRef.current.style.width = '12px';
      cursorRef.current.style.height = '12px';
      cursorRef.current.style.background = '#6366f1';
      followerRef.current.style.width = '36px';
      followerRef.current.style.height = '36px';
      followerRef.current.style.borderColor = 'rgba(99,102,241,0.5)';
    };

    const onMouseClick = () => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform += ' scale(0.7)';
      setTimeout(() => {
        if (cursorRef.current) cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(0.7)', '');
      }, 150);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseClick);

    const interactives = document.querySelectorAll('a, button, input, select, [role="button"], label');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });

    rafRef.current = requestAnimationFrame(animate);

    // Observe DOM for new interactive elements
    const observer = new MutationObserver(() => {
      const newInteractives = document.querySelectorAll('a, button, input, select, [role="button"], label');
      newInteractives.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onMouseClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [animate]);

  return (
    <>
      <div
        id="custom-cursor"
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: '12px',
          height: '12px',
          background: '#6366f1',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          top: 0,
          left: 0,
          transition: 'width 0.2s, height 0.2s, background 0.2s',
          willChange: 'transform',
        }}
      />
      <div
        id="cursor-follower"
        ref={followerRef}
        style={{
          position: 'fixed',
          width: '36px',
          height: '36px',
          border: '2px solid rgba(99,102,241,0.5)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          top: 0,
          left: 0,
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CustomCursor;
