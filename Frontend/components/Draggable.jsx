import React, { MouseEvent, useRef, ReactElement } from 'react';

const Draggable = ({ className, children }) => {
  const slider = useRef(null);

  let mouseDown = false;
  let startX, scrollLeft;

  const startDragging = function (e) {
    mouseDown = true;
    startX = e.pageX - slider.current.offsetLeft;
    scrollLeft = slider.current.scrollLeft;
  };
  const stopDragging = () => {
    mouseDown = false;
  };

  function mouseMoveEvent(e) {
    if (!mouseDown) {
      return;
    }
    const x = e.pageX - slider.current.offsetLeft;
    const scroll = x - startX;
    slider.current.scrollLeft = scrollLeft - scroll;
  }

  return (
    <div
      ref={slider}
      onMouseDown={startDragging}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onMouseMove={mouseMoveEvent}
      className={className}
    >
      {children}
    </div>
  );
};

export default Draggable;
