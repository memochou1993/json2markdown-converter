const initResizableSplitter = (splitter: HTMLElement, mainPane: HTMLElement) => {
  let isResizing = false;

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing) return;
    splitter.classList.add('active');
    mainPane.style.width = `${event.clientX}px`;
  };

  const handleMouseUp = () => {
    isResizing = false;
    splitter.classList.remove('active');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  splitter.addEventListener('mousedown', () => {
    isResizing = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  });
};

export default initResizableSplitter;
