const scrollToAnchor = (hash: string, container: HTMLElement) => {
  if (!hash) return;

  const targetElement = document.querySelector(hash);
  if (!targetElement) return;

  const containerRect = container.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  const targetPosition = targetRect.top - containerRect.top + container.scrollTop;

  container.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
};

export default scrollToAnchor;
