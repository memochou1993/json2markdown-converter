const initResizableDivider = (divider: HTMLElement, mainPanel: HTMLElement) => {
  let isResizing = false;

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    divider.classList.add('active');
    mainPanel.style.width = `${e.clientX}px`;
  };

  const handleMouseUp = () => {
    isResizing = false;
    divider.classList.remove('active');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  divider.addEventListener('mousedown', () => {
    isResizing = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  });
};

export default initResizableDivider;
